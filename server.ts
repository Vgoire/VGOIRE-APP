import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // IMPORTANT: In v0.app and development, server.ts should NOT run
  // The 'dev' script runs 'vite' directly, NOT 'node server.ts'
  // This file is only for production builds
  
  if (process.env.NODE_ENV !== 'production') {
    console.error("[ERROR] server.ts should only run in production. Use 'npm run dev' or 'vite' for development.");
    process.exit(1);
  }

  const app = express();
  const PORT = parseInt(process.env.PORT || "3000");

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "VGOIRE Server is healthy" });
  });

  // Serve static files from the dist directory
  app.use(express.static(path.join(__dirname, "dist")));

  // Handle SPA routing: serve index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Only start server if explicitly running this file in production
if (process.env.NODE_ENV === 'production') {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}
