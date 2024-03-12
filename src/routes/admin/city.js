const express=require('express');
const { addCity, getLocations,getChildCities } = require('../../controllers/admin/city');
const multer=require('multer')
const path=require('path');
const shortid=require('shortid');
const router = express.Router();
const { requireSignIn, adminMiddleware, superAdminMiddleware, userMiddleware } = require('../../common-middleware');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(path.dirname(__dirname),'../uploads'))
    },
    filename:function(req,file,cb){
        cb(null,shortid.generate()+'_'+file.originalname)
    }
  })
  const upload=multer({storage});
router.post("/admin/addCity",upload.array('image'), requireSignIn , adminMiddleware, addCity);

router.get("/admin/getLocations", requireSignIn , adminMiddleware, getLocations);

router.get("/user/getLocations", getLocations);


router.get('/getChildCities/:parentId', getChildCities)
module.exports = router;