import express from "express";
import { register } from "./auth.controller.js";

export const authRoutes = express().router;

authRoutes.use(express.json());

authRoutes.post("/auth/register", register);

// authRoutes.post("/auth/login");

// authRoutes.get("/auth/me");

// authRoutes.patch("/auth/me");
