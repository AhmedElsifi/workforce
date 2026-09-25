import express from "express";
import {
  getCurrentUser,
  login,
  updateCurrentUser,
  logout,
} from "./auth.controller.js";

import { authenticate, authorize } from "../../middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/auth/login", login);

authRoutes.get(
  "/auth/me",
  authenticate,
  authorize("employee", "manager", "admin"),
  getCurrentUser,
);

authRoutes.patch(
  "/auth/me",
  authenticate,
  authorize("employee", "manager", "admin"),
  updateCurrentUser,
);

authRoutes.post(
  "/auth/logout",
  authenticate,
  authorize("employee", "manager", "admin"),
  logout,
);

export default authRoutes;
