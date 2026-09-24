import express from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { adminDashboard, employeeDashboard  } from "./dashboard.controller.js";

export const dashboardRoutes = express().router;

dashboardRoutes.get(
  "/employee/dashboard",
  authenticate,
  authorize("employee"),
  employeeDashboard,
);


dashboardRoutes.get(
  "/admin/dashboard",
  authenticate,
  authorize("admin"),
  adminDashboard,
);

dashboardRoutes.get(
  "/pages/admin/dashboard.html",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.sendFile(path.join(__dirname, "../client/pages/admin/dashboard.html"));
  },
);
