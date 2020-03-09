const moment = require('moment');
const DbManager = require('../db/db_manager');
const Logger = require('../logger');

module.exports = () => {
    Logger.info("calculating top-requester-all-time");

    const action = String((params) => {
        const db = require('@arangodb').db;
        const aql = require('@arangodb').aql;

        const query = aql`
            for profile in Profile
                    collect count=length(for v,e,p in 0..2 any profile._id graph 'main'
                    filter p.vertices[0]!=null 
                    && p.edges[0]!=null && is_same_collection("requests_with", p.edges[0]._id)
                    && p.vertices[1]!=null && is_same_collection("Request", p.vertices[1]._id) && p.vertices[1].status=="completed"
                    && p.edges[1]!=null && is_same_collection("responds_to", p.edges[1]._id)
                    && p.vertices[2]!=null && is_same_collection("Response", p.vertices[2]._id) && p.vertices[2].status=="completed"
                    return 1), profileId = profile._id
                sort count DESC
                limit 100
                return {profileId:profileId, count : count}
        `;
        let results = db._query(query);

        // disable current badges
        const query2 = aql`
            for badge in Badge
            filter badge.category=="top-requester-all-time"
                for v,e,p in 0..1 outbound badge._id graph 'main'
                filter p.edges[0]!=null && is_same_collection('awards', p.edges[0]._id)
                update p.edges[0] with {active:false, expiredOn:${params.now}} in awards 
        `;
        db._query(query2);
        // set badges for current badges

        results.toArray().forEach((result, index) => {
            let profileId = result.profileId;
            let badgeId = "";
            if (index === 0) {
                badgeId = "Badge/top-requester-all-time-1";
            } else if (index < 10) {
                badgeId = "Badge/top-requester-all-time-10";
            } else if (index < 100) {
                badgeId = "Badge/top-requester-all-time-100";
            } else {
                return;
            }
            db.awards.save({
                _from: badgeId,
                _to: profileId,
                createdOn: params.now,
                active: true,
            });
        })
    });

    return DbManager.db.transaction({
        read: ["Badge", "Profile", "Request", "Response", "requests_with", "responds_to"],
        write: ["awards"]
    }, action, {
        now: moment().utc().toDate()
    })
        .then(() => {
            Logger.info("calculating top-requester-all-time successful");
        })
        .catch(error => {
            Logger.error(error);
            Logger.error("calculating top-requester-all-time failed");
        });
};