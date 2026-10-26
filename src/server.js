import app from "./app.js";
import { env } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";

await connectDB();

app.listen(env.port, () => {
  console.log(`Servidor escuchando en el puerto ${env.port}`);
});
