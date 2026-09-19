import mongoose from "mongoose";

const dbConnection = mongoose
  .connect("mongodb://localhost:27017/WorkForce")
  .then(() => console.log("db connected"))
  .catch((err) => console.log("db error", err));

export default dbConnection;
