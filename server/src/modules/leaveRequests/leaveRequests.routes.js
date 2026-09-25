import express from "express";
import {
	createLeaveRequest,
	getMyLeaveRequests,
	getPendingLeaveRequests,
	updateLeaveStatus,
} from "./leaveRequests.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";

const leaveRoutes = express.Router();

leaveRoutes.post("/", authenticate, authorize("employee"), createLeaveRequest);
leaveRoutes.get("/my-requests", authenticate, authorize("employee"), getMyLeaveRequests);
leaveRoutes.get("/pending", authenticate, authorize("manager"), getPendingLeaveRequests);
leaveRoutes.patch("/:id/status", authenticate, authorize("manager"), updateLeaveStatus);

export default leaveRoutes;
