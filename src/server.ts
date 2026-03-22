import "dotenv/config";
import express from "express";
import router from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1", router);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  console.log(`Books API:      http://localhost:${PORT}/api/v1/books`);
  console.log(`Authors API:    http://localhost:${PORT}/api/v1/authors`);
  console.log(`Publishers API: http://localhost:${PORT}/api/v1/publishers`);
  console.log(`Genres API:     http://localhost:${PORT}/api/v1/genres`);
});

export default app;