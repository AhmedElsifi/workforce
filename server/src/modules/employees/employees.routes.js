import express from "express";
import checkId from "../../middlewares/checkId.js";
import {
createEmployee,
getEmployees,
getEmployeeById,
updateEmployee,
deactivateEmployee,
} from "./employees.controller.js";
const employeesRoutes = express.Router();

employeesRoutes.use(express.json());
employeesRoutes.post("/employees", createEmployee);
employeesRoutes.get("/employees", getEmployees);
employeesRoutes.get("/employees/:id",checkId, getEmployeeById);
employeesRoutes.put("/employees/:id",checkId, updateEmployee);
employeesRoutes.patch("/employees/:id/deactivate", checkId, deactivateEmployee);
export { employeesRoutes };