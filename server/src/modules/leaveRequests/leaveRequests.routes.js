// convert cjs to express
import express from "express";
import * as leaveController from "./leaveRequests.controller.js";
const router = express.Router();
// Employee routes
router.post('/', leaveController.createLeaveRequest);
router.get('/my-requests', leaveController.getMyLeaveRequests);

// Manager routes
router.get('/pending', leaveController.getPendingLeaveRequests);
router.patch('/:id/status', leaveController.updateLeaveStatus);

export default router; //edit 