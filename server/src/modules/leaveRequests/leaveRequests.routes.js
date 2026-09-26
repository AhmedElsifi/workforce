import express from "express";
import {
  createLeaveRequest,
  getMyLeaveRequests,
  getPendingLeaveRequests,
  getAllLeaveRequests,
  updateLeaveStatus,
} from "./leaveRequests.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";

const leaveRoutes = express.Router();

leaveRoutes.post(
  "/leave-requests/new-request",
  authenticate,
  authorize("employee"),
  createLeaveRequest,
);

leaveRoutes.get(
  "/leave-requests/my-requests",
  authenticate,
  authorize("employee"),
  getMyLeaveRequests,
);

leaveRoutes.get(
  "/leave-requests/pending",
  authenticate,
  authorize("manager"),
  getPendingLeaveRequests,
);

leaveRoutes.get(
  "/leave-requests",
  authenticate,
  authorize("manager"),
  getAllLeaveRequests,
);

leaveRoutes.patch(
  "/leave-requests/:id/status",
  authenticate,
  authorize("manager"),
  updateLeaveStatus,
);

export default leaveRoutes;
