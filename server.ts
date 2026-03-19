import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000");

  // Skip server startup in v0.app development environment
  if (process.env.DISABLE_HMR === 'true' && !process.env.NODE_ENV?.includes('production')) {
    console.log("[v0] Development mode: server.ts skipped, use 'vite' command instead");
    return;
  }

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "VGOIRE Server is healthy" });
  });

  if (process.env.NODE_ENV === "production") {
    // Serve static files from the dist directory
    app.use(express.static(path.join(__dirname, "dist")));

    // Handle SPA routing: serve index.html for all non-API routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  } else {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
