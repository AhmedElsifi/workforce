const express = require('express');
const router = express.Router();
const leaveController = require('./leaveRequests.controller');

// Employee routes
router.post('/', leaveController.createLeaveRequest);
router.get('/my-requests', leaveController.getMyLeaveRequests);

// Manager routes
router.get('/pending', leaveController.getPendingLeaveRequests);
router.patch('/:id/status', leaveController.updateLeaveStatus);

module.exports = router;