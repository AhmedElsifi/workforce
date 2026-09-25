import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { adminDashboard, managerDashboard, employeeDashboard  } from "./dashboard.controller.js";

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
