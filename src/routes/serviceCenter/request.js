const express=require('express');
const { requestAsPatner, getAllRequests } = require("../../controllers/serviceCenter/request");
const router=express.Router();


router.post('/serviceCenter/requestAsPatner',  requestAsPatner);



module.exports=router;