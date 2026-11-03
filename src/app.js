import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import viewsRouter from "./routes/views.router.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log(`Petición recibida: ${req.method} de la ruta ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hola Mundo");
});

app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/views", viewsRouter);


app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

export default app;
