const express = require('express');
const { createReminder, getAllReminders, deleteReminder } = require('../../controllers/admin/reminder');
const { requireSignIn, adminMiddleware } = require('../../common-middleware');
const router = express.Router();

router.post('/admin/createReminder', requireSignIn, adminMiddleware, createReminder);
router.get('/admin/getAllReminders', requireSignIn, adminMiddleware, getAllReminders);
router.delete('/admin/deleteReminder/:id', requireSignIn, adminMiddleware, deleteReminder);

module.exports = router;