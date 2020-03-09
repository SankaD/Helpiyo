const moment = require('moment');
const DbManager = require('../db/db_manager');
const Logger = require('../logger');

module.exports = () => {
    Logger.info("calculating rankings");

    const action = String(params => {
        const db = require('@arangodb').db;
        const aql = require('@arangodb').aql;

        const pointsPerRequest = 10;
        const pointsPerSosRequest = 1;
        const pointsPerResponse = 20;
        const pointsPerSosResponse = 100;

        const requestQuery = aql`
            FOR profile IN Profile
            COLLECT points=SUM(
                FOR v,e,p IN 0..2 ANY profile._id GRAPH 'main'
                FILTER p.vertices[0]!=null 
                && p.edges[0]!=null && is_same_collection("requests_with", p.edges[0]._id)
                && p.vertices[1]!=null && is_same_collection("Request", p.vertices[1]._id) && p.vertices[1].status=="completed"
                && p.edges[1]!=null && is_same_collection("responds_to", p.edges[1]._id)
                && p.vertices[2]!=null && is_same_collection("Response", p.vertices[2]._id) && p.vertices[2].status=="completed"
                RETURN ((p.vertices[1].sos?${pointsPerSosRequest}:${pointsPerRequest}) * p.vertices[2].responderRating) 
            ),
             points2=SUM(
                FOR v,e,p IN 0..2 ANY profile._id GRAPH 'main'
                FILTER p.edges[0]!=null && is_same_collection("responds_with", p.edges[0]._id)
                && p.vertices[1]!=null && is_same_collection("Response", p.vertices[1]._id) && p.vertices[1].status=="completed"
                && p.edges[1]!=null && is_same_collection("responds_to", p.edges[1]._id)
                && p.vertices[2]!=null && is_same_collection("Request", p.vertices[2]._id) && p.vertices[2].status=="completed"
                RETURN ((p.vertices[2].sos?${pointsPerSosResponse}:${pointsPerResponse}) * p.vertices[1].requesterRating) 
            ),
            p = profile
            UPDATE p WITH {points: 0 + points||0 + points2||0, modifiedOn:${params.now}} IN Profile 
        `;
        db._query(requestQuery);

        const ratingQuery = aql`
            FOR profile IN Profile
            COLLECT requesterPointsList=(
                FOR v,e,p IN 0..2 ANY profile._id GRAPH 'main'
                FILTER p.vertices[0]!=null 
                && p.edges[0]!=null && is_same_collection("requests_with", p.edges[0]._id)
                && p.vertices[1]!=null && is_same_collection("Request", p.vertices[1]._id) && p.vertices[1].status=="completed"
                && p.edges[1]!=null && is_same_collection("responds_to", p.edges[1]._id)
                && p.vertices[2]!=null && is_same_collection("Response", p.vertices[2]._id) && p.vertices[2].status=="completed"
                RETURN {rating:p.vertices[2].responderRating, sos:p.vertices[1].sos}
            ),
				responderPointsList=(
				FOR v,e,p IN 0..2 ANY profile._id GRAPH 'main'
                FILTER p.edges[0]!=null && is_same_collection("responds_with", p.edges[0]._id)
                && p.vertices[1]!=null && is_same_collection("Response", p.vertices[1]._id) && p.vertices[1].status=="completed"
                && p.edges[1]!=null && is_same_collection("responds_to", p.edges[1]._id)
                && p.vertices[2]!=null && is_same_collection("Request", p.vertices[2]._id) && p.vertices[2].status=="completed"
                RETURN {rating:p.vertices[1].requesterRating, sos:p.vertices[2].sos}
				),
				p = profile
			UPDATE p with {rating:(0 + sum(for i in requesterPointsList return i.rating)||0 + sum(for i in responderPointsList return i.rating)||0)/
				(count(for i in requesterPointsList return i.rating)||0 + count(for i in responderPointsList return i.rating)||1)} IN Profile
        `;
        db._query(ratingQuery);

        const rankingQuery = aql`
            FOR profile IN Profile
            sort profile.points DESC
            return {_id:profile._id}
        `;
        const results = db._query(rankingQuery).toArray();
        results.forEach((id, index) => {
            let classString = "";
            let classRanking = index + 1;
            if (index < 10) {
                classString = "X";
            } else if (index < 100) {
                classString = "S";
                classRanking -= 10;
            } else if (index < 10000) {
                classString = "A";
                classRanking -= 100;
            } else if (index < 100000) {
                classString = "B";
                classRanking -= 10000;
            } else if (index < 1000000) {
                classString = "C";
                classRanking -= 100000;
            } else {
                classString = "N";
                classRanking -= 1000000;
            }

            db.Profile.update(id, {
                ranking: index + 1,
                classLabel: classString,
                classRanking: classRanking
            });
        });
    });

    return DbManager.db.transaction({
        read: ["Request", "Response", "requests_with", "responds_to"],
        write: ["Profile"]
    }, action, {
        now: moment().utc().toDate()
    })
        .then(() => {
            Logger.info("rankings calculated successfully");
        })
        .catch(error => {
            Logger.error("rankings calculation failed");
            Logger.error(error);
        });
};