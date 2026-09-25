import mongoose from "mongoose";

const dbConnection = mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then(() => console.log("db connected"))
  .catch((err) => console.log("db error", err));

export default dbConnection;
