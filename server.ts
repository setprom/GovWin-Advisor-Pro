import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILE = path.join(__dirname, "config.json");
const HISTORY_FILE = path.join(__dirname, "history.json");
const ENGINEERING_LOG_FILE = path.join(__dirname, "engineering_log.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/config", (req, res) => {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, "utf-8");
      res.json(JSON.parse(data));
    } else {
      res.json({ geminiApiKey: "", samApiKey: "" });
    }
  });

  app.post("/api/config", (req, res) => {
    const config = req.body;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    res.json({ status: "ok" });
  });

  app.get("/api/history", (req, res) => {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, "utf-8");
      res.json(JSON.parse(data));
    } else {
      res.json([]);
    }
  });

  app.post("/api/history", (req, res) => {
    const history = req.body;
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    res.json({ status: "ok" });
  });

  app.get("/api/engineering-log", (req, res) => {
    if (fs.existsSync(ENGINEERING_LOG_FILE)) {
      const data = fs.readFileSync(ENGINEERING_LOG_FILE, "utf-8");
      res.json(JSON.parse(data));
    } else {
      res.json([]);
    }
  });

  app.post("/api/engineering-log", (req, res) => {
    const log = req.body;
    fs.writeFileSync(ENGINEERING_LOG_FILE, JSON.stringify(log, null, 2));
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
