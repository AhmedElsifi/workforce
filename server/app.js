import express from "express";
import "dotenv/config";
import dbConnection from "./db/dbConnection.js";
import { authRoutes } from "./src/modules/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import { employeesRoutes } from "./src/modules/employees/employees.routes.js";
import { dashboardRoutes } from "./src/modules/dashboard/dashboard.routes.js";
import cors from "cors";
import { seedData } from "./DB seeder.js";

dbConnection;

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  }),
);

// call this function once and then comment it again (used to add dummy data to the database):
// seedData();

app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(employeesRoutes);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
const leaveRoutes = require('./src/modules/leaveRequests/leaveRequests.routes');

// Mount Leave Management Routes
app.use('/api/leave-requests', leaveRoutes);