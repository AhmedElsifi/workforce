import express from "express";
import "dotenv/config";
import cors from "cors";
import dbConnection from "./db/dbConnection.js";
import { authRoutes } from "./src/modules/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import { dashboardRoutes } from "./src/modules/dashboard/dashboard.routes.js";

dbConnection;

const app = express();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, "../client")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(authRoutes);
app.use(dashboardRoutes);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
