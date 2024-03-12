const express = require('express');
const { restoreFromTrash, getTrashItems, permanentlyDeleteFromTrash, clearTrash } = require('../../controllers/admin/trashBin');
const { requireSignIn, adminMiddleware } = require('../../common-middleware');
const router=express.Router();

router.get('/admin/trash', requireSignIn,adminMiddleware, getTrashItems);
router.put('/admin/trash/restore/:id', restoreFromTrash);
router.delete('/admin/trash/delete/:id', requireSignIn,adminMiddleware, permanentlyDeleteFromTrash);
router.delete('/admin/trash/clear', requireSignIn,adminMiddleware, clearTrash);

module.exports = router;