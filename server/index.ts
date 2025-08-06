import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getItemMatches,
  updateMatchStatus,
  getCategories,
} from "./routes/items";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Items API routes
  app.get("/api/items", getItems);
  app.get("/api/items/:id", getItem);
  app.post("/api/items", createItem);
  app.put("/api/items/:id", updateItem);
  app.delete("/api/items/:id", deleteItem);

  // Matching API routes
  app.get("/api/items/:id/matches", getItemMatches);
  app.put("/api/matches/:matchId/status", updateMatchStatus);

  // Utility routes
  app.get("/api/categories", getCategories);

  return app;
}
