const express = require('express');
const router = express.Router();
const { requireSignIn, adminMiddleware } = require('../../common-middleware/index');
const path = require('path');
const multer = require('multer');
const shortid=require('shortid');
const {addposts, getposts,getpost,putPost, deletePost, getPostsBySubcategories, getPostsByCategory, newComment} = require('../../controllers/admin/blog');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname);
  }
});
const upload = multer({ storage });
router.post('/user/blog/addposts',upload.array('cover'), requireSignIn, adminMiddleware, addposts);
router.delete('/user/blog/deletepost/:id', requireSignIn, adminMiddleware, deletePost);
router.put('/user/blog/updatepost/:id', upload.array('cover'), requireSignIn, adminMiddleware, putPost);
router.get('/user/blog/posts', getposts);
router.get('/user/blog/posts/:id', getpost);
router.get('/user/BySubcategory/:subCategoryName', getPostsBySubcategories);
router.get('/user/ByCategory/:categoryName', getPostsByCategory);



module.exports = router