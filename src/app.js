import express from "express";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";

const app = express();

app.use(express.json());

// Logging simple de cada petición
app.use((req, res, next) => {
  console.log(`Petición recibida: ${req.method} de la ruta ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hola Mundo");
});

app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

export default app;
