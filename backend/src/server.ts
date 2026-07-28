import "./config/env.js";
import express from "express";
import pool from "./db/database.js";
import { env } from "./config/env.js";
//routes
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import contractRoutes from "./routes/contract.routes.js";
import chargeRoutes from "./routes/charge.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import collectionRoutes from "./routes/collection.routes.js";
//middleware
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

//check if request reaches Express
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/charges", chargeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/worklist", collectionRoutes);

// LAST middleware
app.use(errorHandler);

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

async function testDatabaseConnection() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("✅ Database connected");
    console.log(result.rows[0]);
  } catch (err) {
    console.error("❌ Database connection failed");
    console.error(err);
  }
}

testDatabaseConnection();
