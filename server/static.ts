import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist,
  // but return JSON 404 for unknown API routes
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API endpoint not found" });
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
