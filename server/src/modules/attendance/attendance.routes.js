import express from "express";
import {
  authenticate,
  authorize,
} from "../../middlewares/auth.middleware.js";
import {
  checkIn,
  checkOut,
  getAttendanceHistory,
} from "./attendance.controller.js";

export const attendanceRoutes = express.Router();

attendanceRoutes.post(
  "/attendance/check-in",
  authenticate,
  authorize("employee"),
  checkIn,
);

attendanceRoutes.post(
  "/attendance/check-out",
  authenticate,
  authorize("employee"),
  checkOut,
);

attendanceRoutes.get(
  "/attendance/history",
  authenticate,
  authorize("employee"),
  getAttendanceHistory,
);