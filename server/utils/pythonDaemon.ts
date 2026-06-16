import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../..");

export function getPythonDaemonPath(): string {
  const envPath = process.env.PYTHON_DAEMON_PATH;
  if (envPath) {
    const resolved = path.resolve(envPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(
        `PYTHON_DAEMON_PATH is set to "${envPath}" but resolved path "${resolved}" does not exist.`
      );
    }
    return resolved;
  }

  const mainPy = path.join(PROJECT_ROOT, "main.py");
  if (fs.existsSync(mainPy)) {
    return mainPy;
  }

  const analyzePy = path.join(PROJECT_ROOT, "analyze.py");
  if (fs.existsSync(analyzePy)) {
    return analyzePy;
  }

  throw new Error(
    "Python daemon script not found. Ensure main.py or analyze.py exists at the project root, " +
      "or set the PYTHON_DAEMON_PATH environment variable."
  );
}
