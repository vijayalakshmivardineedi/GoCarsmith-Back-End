const express = require('express');
const {addOrUpdateComment, getComments, getPersonalizedComment, deleteCommentPersonalized,
    updateLikedStatus,  getParticularLikes, deleteLikedStatus, getLikesAndDislikesCount, } = require('../../controllers/user/interaction');
const { userMiddleware } = require('../../common-middleware');

const router=express.Router();

//comment
router.post('/user/addOrUpdateComment/:likedItemId', addOrUpdateComment);
router.delete('/user/deleteCommentPersonalized/:likedItemId', deleteCommentPersonalized);
router.get('/user/getComments/:likedItemId', getComments),
router.get('/user/getPersonalizedComment/:email/:likedItemId', getPersonalizedComment);


//likes
router.post('/user/updateLikedStatus/:likedItemId', updateLikedStatus);
router.get('/user/getTotalLikes/:likedItemId', getLikesAndDislikesCount);
router.get('/user/getParticularLikes/:email/:likedItemId', getParticularLikes);



module.exports = router