import express from "express";
import { getCurrentUser, login, updateCurrentUser } from "./auth.controller.js";

import { authenticate, authorize } from "../../middlewares/auth.middleware.js";

const authRoutes = express().router;

authRoutes.post("/auth/login", login);

authRoutes.get("/auth/me", authenticate, getCurrentUser);

authRoutes.patch(
  "/auth/me",
  authenticate,
  authorize("employee"),
  updateCurrentUser,
);

export default authRoutes;
