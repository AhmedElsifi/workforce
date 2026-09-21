import express from "express";
import { login, register } from "./auth.controller.js";

export const authRoutes = express().router;

authRoutes.post("/auth/register", register);

authRoutes.post("/auth/login", login);

// authRoutes.get("/auth/me");

// authRoutes.patch("/auth/me");
