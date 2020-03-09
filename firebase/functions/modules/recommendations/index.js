const express = require("express");
const logger = require('../utils/logger');

const getRequestRecommendations = require('./get_request_recommendations');
const getServiceRecommendations = require('./get_service_recommendations');

const router = express.Router();

router.get("/get-for-request/:requestId",(req,res)=>{
    const userId=req.user._id;
    const requestId=req.params.requestId;

    return getRequestRecommendations(userId,requestId)
        .then(result=>{
            return res.status(200).json(result);
        })
        .catch(error=>{
            return res.status(400).json(error);
        });
});

module.exports = router;