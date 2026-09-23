import express from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { employeeProfile } from "./employees.controller.js";

export const employeesRoutes = express().router;

employeesRoutes.get(
  "/employee/profile",
  //   authenticate,
  //   authorize("admin"),
  employeeProfile,
);

employeesRoutes.get(
  "/pages/employee/profile.html",
  //   authenticate,
  //   authorize("employee"),
  (req, res) => {
    res.sendFile(path.join(__dirname, "../client/pages/employee/profile.html"));
  },
);
