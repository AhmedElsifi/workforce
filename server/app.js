import express from "express";
import dbConnection from "./db/dbConnection.js";
import { authRoutes } from "./src/modules/auth/auth.routes.js";

dbConnection;

const app = express();

app.use(authRoutes);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
