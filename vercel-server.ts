// CRITICAL: Check environment BEFORE importing anything else
// This prevents server startup in development/v0.app
if (process.env.NODE_ENV !== 'production') {
  console.error("[v0] ERROR: server.ts should ONLY run in production mode.");
  console.error("[v0] For development, use: npm run dev");
  process.exit(1);
}

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
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

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
