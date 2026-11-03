import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { env } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";


await connectDB();

const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);
  socket.on("disconnect", () => console.log(`Cliente desconectado: ${socket.id}`));
});

httpServer.listen(env.port, () => {
  console.log(`Servidor escuchando en el puerto ${env.port}`);
});
