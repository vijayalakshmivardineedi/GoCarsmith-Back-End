const express = require('express');
const { addAddress } = require('../../controllers/user/ManageAddress');
const router = express.Router();
router.post('/user/addAddress', addAddress);
module.exports=router;