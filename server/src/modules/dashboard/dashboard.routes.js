import express from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import {
  adminDashboard,
  managerDashboard,
  employeeDashboard,
} from "./dashboard.controller.js";

const dashboardRoutes = express().router;

dashboardRoutes.get(
  "/employee/dashboard",
  authenticate,
  authorize("employee"),
  employeeDashboard,
);

dashboardRoutes.get(
  "/dashboard/admin",
  authenticate,
  authorize("admin"),
  adminDashboard,
);

dashboardRoutes.get(
  "/dashboard/manager",
  authenticate,
  authorize("manager"),
  managerDashboard,
);

dashboardRoutes.get(
  "/dashboard/employee",
  authenticate,
  authorize("employee"),
  employeeDashboard,
);

export default dashboardRoutes;
