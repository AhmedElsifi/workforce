import express from "express";
import { getCurrentUser, login } from "./auth.controller.js";

export const authRoutes = express().router;

authRoutes.post("/auth/login", login);

authRoutes.get("/auth/me", getCurrentUser);

// authRoutes.patch("/auth/me");
