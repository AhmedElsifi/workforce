import express from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { getAllLogs, getRecentActivity } from "./audit.controller.js";

export const auditRoutes = express().router;

auditRoutes.get("/audit", authenticate, authorize("admin"), getAllLogs);

auditRoutes.get(
  "/audit/recent",
  authenticate,
  authorize("admin"),
  getRecentActivity,
);
