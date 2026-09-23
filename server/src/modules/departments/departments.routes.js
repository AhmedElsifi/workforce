import express from "express";
import { createDepartment, getDepartments, updateDepartment, deleteDepartment } from "./departments.controller.js";

export const departmentsRoutes = express().router;
departmentsRoutes.use(express.json());
departmentsRoutes.post("/departments", createDepartment);
departmentsRoutes.get("/departments", getDepartments);
departmentsRoutes.put("/departments/:id", updateDepartment);
departmentsRoutes.delete("/departments/:id", deleteDepartment);