import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor arrancado correctamente");
});

app.use((req, res) => {
  res.status(404).send({ error: "Recurso no encontrado" });
});

export default app;
