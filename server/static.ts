import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function injectNonce(html: string, nonce: string): string {
  if (!nonce) return html;
  return html
    .replace(/<script\b/gi, `<script nonce="${nonce}"`)
    .replace(/<link\b/gi, `<link nonce="${nonce}"`);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.get("*", (req: Request, res: Response) => {
    const filePath = path.resolve(distPath, "index.html");
    const nonce = (res as any).locals?.nonce || "";
    if (nonce) {
      const html = fs.readFileSync(filePath, "utf-8");
      res.type("html").send(injectNonce(html, nonce));
    } else {
      res.sendFile(filePath);
    }
  });
}
