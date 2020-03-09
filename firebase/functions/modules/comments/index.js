const express = require('express');
const router = express.Router();

const createComment = require('./create_comment');
const getCommentsFor = require('./get_comments_for');

router.post("/create/", (req, res) => {
    const userId = req.user._id;
    const commentData = req.body;
    return createComment(userId, commentData)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

router.get("/get-comments-for/:targetType/:targetId", (req, res) => {
    const userId = req.user._id;
    const targetType = req.params.targetType;
    const targetId = req.params.targetId;
    return getCommentsFor(userId, targetType, targetId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});
//
// router.post('/get-multiple', (req, res) => {
//     const userId = req.user._id;
//     const ids = req.body;
//     return getMultiple(userId, ids)
//         .then(result => {
//             return res.status(200).json(result);
//         })
//         .catch(error => {
//             return res.status(400).json(error);
//         });
// });
//
// router.post("/get-multiple-meta", (req, res) => {
//     const userId = req.user._id;
//     const ids = req.body;
//     return getMultipleMeta(userId, ids)
//         .then(result => {
//             return res.status(200).json(result);
//         })
//         .catch(error => {
//             return res.status(400).json(error);
//         });
// });
module.exports = router;