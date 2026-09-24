import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import {
  adminDashboard,
  managerDashboard,
  employeeDashboard,
} from "./dashboard.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dashboardRoutes = express().router;

dashboardRoutes.get(
  "/admin/dashboard",
  authenticate,
  authorize("admin"),
  adminDashboard,
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

dashboardRoutes.get(
  "/pages/admin/dashboard.html",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.sendFile(
      path.resolve(
        __dirname,
        "../../../../client/pages/admin/dashboard.html",
      ),
    );
  },
);
