const moment = require('moment');
const Logger = require('../utils/logger');
const Profile = require('../models/profile');

module.exports = () => {
    Logger.info("calculating rankings");

    return Profile.aggregate([{
        $match: {
            status: "active",
            banned: false,
            deactivated: false
        }
    }, {
        $project: {
            _id: 1,
            status: 1,
            createdOn: 1
        }
    }, {
        $lookup: {
            from: 'responses',
            as: 'myResponses',
            let: {
                proId: "$_id",
            },
            pipeline: [{
                $match: {
                    status: "completed",
                    resolution: {
                        $in: ["accepted", "rejected"]
                    },
                    $expr: {
                        $eq: [{$toString: "$createdBy"}, {$toString: "$$proId"}]
                    }
                }
            }, {
                $project: {
                    requesterRating: 1,
                }
            }, {
                $group: {
                    _id: "$$proId",
                    rating: {
                        $sum: "$requesterRating"
                    },
                    count: {$sum: 1}
                }
            }]
        }
    }, {
        $lookup: {
            from: 'responses',
            as: 'myRequests',
            let: {
                proId: "$_id"
            },
            pipeline: [{
                $match: {
                    status: "completed",
                    resolution: {
                        $in: ["accepted", "rejected"]
                    },
                    $expr: {
                        $eq: [{$toString: "$requestCreatorId"}, {$toString: "$$proId"}]
                    }
                }
            }, {
                $project: {
                    responderRating: 1
                }
            }, {
                $group: {
                    _id: "$$proId",
                    rating: {
                        $sum: "$responderRating"
                    },
                    count: {$sum: 1}
                }
            }]
        }
    }, {
        $lookup: {
            from: 'points',
            as: 'points',
            let: {
                proId: "$_id"
            },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: [{$toString: "$profileId"}, {$toString: "$$proId"}]
                    }
                }
            }, {
                $group: {
                    _id: "$$proId",
                    points: {
                        $sum: "$value"
                    },
                    absolutePoints: {
                        $sum: {$abs: "$value"}
                    }
                }
            }]
        }
    }, {
        $project: {
            myRequestsRating: {
                $ifNull: [{
                    $arrayElemAt: ["$myRequests.rating", 0]
                }, 0]
            },
            myRequestsCount: {
                $ifNull: [{
                    $arrayElemAt: ["$myRequests.count", 0]
                }, 0]
            },
            myResponsesRating: {
                $ifNull: [{
                    $arrayElemAt: ["$myResponses.rating", 0]
                }, 0]
            },
            myResponsesCount: {
                $ifNull: [{
                    $arrayElemAt: ["$myResponses.count", 0]
                }, 0]
            },
            points: {
                $ifNull: [{
                    $arrayElemAt: ["$points.points", 0]
                }, 0]
            },
            absolutePoints: {
                $ifNull: [{
                    $arrayElemAt: ["$points.absolutePoints", 0]
                }, 0]
            }
        }
    }, {
        $project: {
            points: 1,
            absolutePoints: 1,
            rating: {
                $cond: {
                    if: {
                        $eq: [{
                            $add: ["$myRequestsCount", "$myResponsesCount"]
                        }, 0]
                    },
                    then: 0,
                    else: {
                        $divide: [{
                            $add: ["$myRequestsRating", "$myResponsesRating"]
                        }, {
                            $add: ["$myRequestsCount", "$myResponsesCount"]
                        }]
                    }
                }
            }
        }
    }, {
        $sort: {
            absolutePoints: -1,
            rating: -1,
            createdOn: 1
        }
    }])
        .allowDiskUse(true)
        .exec()
        .then(results => {
            Logger.info("aggregation complete");
            let promises = results.map((result, index) => {
                Logger.info(result);
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
                return Profile.updateOne({_id: result._id}, {
                    points: result.points,
                    absolutePoints: result.absolutePoints,
                    rating: result.rating,
                    ranking: index + 1,
                    classRanking: classRanking,
                    classLabel: classString,
                }).exec();
            });
            return Promise.all(promises);
        })
        .then((results) => {
            Logger.info("ratings and rankings updated. count : " + results.length);
        })
        .catch(error => {
            Logger.error("rankings calculation failed");
            Logger.error(error);
        });
};