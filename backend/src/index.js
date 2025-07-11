// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";

// import authRoutes from "./routes/auth.route.js";
// import messageRoutes from "./routes/message.route.js";
// import { app, server } from "./lib/socket.js";
// import { connectDB } from "./lib/db.js";

// dotenv.config();
// const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://chatapp-7-cse0.onrender.com"],
//     credentials: true,
//   })
// );

// // Debug route paths (detect malformed ones)
// function logRouterPaths(router, label) {
//   try {
//     if (router?.stack) {
//       console.log(`\n--- ${label} Routes ---`);
//       router.stack.forEach((layer) => {
//         if (layer.route) {
//           const method = Object.keys(layer.route.methods)[0].toUpperCase();
//           const path = layer.route.path;
//           console.log(`${method} ${path}`);
//         }
//       });
//     } else {
//       console.log(`${label} has no stack or routes`);
//     }
//   } catch (err) {
//     console.error(`Failed to parse ${label} routes:`, err.message);
//   }
// }
// // Mount API routes FIRST (before static files)
// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// // Serve frontend in production
// if (process.env.NODE_ENV === "deployment") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   // Handle client-side routing - middleware approach
//   app.use((req, res, next) => {
//     // Skip API routes
//     if (req.path.startsWith("/api/")) {
//       return next();
//     }
//     // Serve index.html for all non-API routes
//     res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//   });
// }

// // Start server
// server.listen(PORT, () => {
//   console.log(`\n✅ Server is running on http://localhost:${PORT}`);
//   connectDB();
// });

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://chatapp-7-cse0.onrender.com"],
    credentials: true,
  })
);

// Mount API routes FIRST (before static files)
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "deployment") {
  // Correct path for Render deployment structure
  const frontendPath = path.join(__dirname, "frontend/dist");

  console.log("Frontend path:", frontendPath);
  console.log("__dirname:", __dirname);

  app.use(express.static(frontendPath));

  // Handle client-side routing - middleware approach
  app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api/")) {
      return next();
    }
    // Serve index.html for all non-API routes
    const indexPath = path.join(frontendPath, "index.html");
    console.log("Serving index.html from:", indexPath);
    res.sendFile(indexPath);
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`\n✅ Server is running on http://localhost:${PORT}`);
  connectDB();
});
