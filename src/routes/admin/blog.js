const express = require('express');
const router = express.Router();
const { requireSignIn, adminMiddleware } = require('../../common-middleware/index');
const path = require('path');
const multer = require('multer');
const shortid=require('shortid');
const { addposts,getposts,getpost,putPost, deletePost, getPostsBySubcategories, getPostsByCategory} = require('../../controllers/admin/blog');
const { getUserServicesFromAppointment } = require('../../controllers/serviceCenter/OnsiteAppointments');
const { getLikesAndDislikesCount } = require('../../controllers/user/interaction');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname);
  }
});
const upload = multer({ storage });
router.post('/admin/blog/addposts',upload.array('cover'), requireSignIn, adminMiddleware, addposts);
router.delete('/admin/blog/deletepost/:id', requireSignIn, adminMiddleware, deletePost);
router.put('/admin/blog/updatepost/:id', upload.array('cover'), requireSignIn, adminMiddleware, putPost);
router.get('/admin/blog/posts', requireSignIn, adminMiddleware, getposts);
router.get('/admin/blog/posts/:id',requireSignIn, adminMiddleware, getpost);
router.get('/admin/BySubcategory', requireSignIn, adminMiddleware, getPostsBySubcategories);
router.get('/admin/ByCategory', requireSignIn, adminMiddleware, getPostsByCategory);
router.get('/admin/getComments/:likedItemId', requireSignIn, adminMiddleware, getUserServicesFromAppointment),
router.get('/admin/getTotalLikes/:likedItemId', requireSignIn, adminMiddleware, getLikesAndDislikesCount);

module.exports = router