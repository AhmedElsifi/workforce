import mongoose from "mongoose";

const uri = process.env.MONGO_DB_CONNECTION_STRING;

if (!uri) {
  console.error("FATAL: MONGO_DB_CONNECTION_STRING environment variable is missing.");
  throw new Error("MONGO_DB_CONNECTION_STRING is not set");
}

// Log the host only — never the full string (it contains the password).
const sanitized = uri.replace(/\/\/([^@]+)@/, "//<credentials>@");
console.log("MongoDB connection target:", sanitized);

const dbConnection = mongoose
  .connect(uri, { serverSelectionTimeoutMS: 8000 })
  .then((m) => {
    console.log("db connected to host:", m.connection.host);
  })
  .catch((err) => {
    console.error("FATAL db connection error:", err.message);
    console.error("Connection target (sanitized):", sanitized);
    // Re-throw so Vercel's logs mark this as a failed deployment instead of a success.
    throw err;
  });

export default dbConnection;