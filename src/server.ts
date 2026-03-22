import "dotenv/config";
import express from "express";
import bookRoutes from "./routes/book.routes.js";
const app = express();
/*
Serveri port.
Kui .env failis on PORT defineeritud,
siis kasutatakse seda.
*/
const PORT = Number(process.env.PORT) || 3000;
/*
Middleware JSON päringute töötlemiseks
*/
app.use(express.json());
/*
API route'id
Kõik route'id algavad prefiksiga /api/v1
*/
app.use("/api/v1", bookRoutes);
/*
Serveri käivitamine
*/
app.listen(PORT, () => {
  console.log(`Server töötab: http://localhost:${PORT}`);
  console.log(`Books API:
http://localhost:${PORT}/api/v1/books`);
});
