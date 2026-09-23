import express from "express";
import "dotenv/config";
import dbConnection from "./db/dbConnection.js";
import { authRoutes } from "./src/modules/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import { employeesRoutes } from "./src/modules/employees/employees.routes.js";
import { dashboardRoutes } from "./src/modules/dashboard/dashboard.routes.js";
import cors from "cors";

dbConnection;

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(employeesRoutes);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
