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

authRoutes.get("/auth/me", authenticate, getCurrentUser);

authRoutes.patch(
  "/auth/me",
  authenticate,
  authorize("employee", "manager"),
  updateCurrentUser,
);

authRoutes.post("/auth/logout", authenticate, logout);

export default authRoutes;
