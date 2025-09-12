import express, { Application } from "express";

class App {
  private readonly expressApp: Application;

  constructor() {
    this.expressApp = express();
    // middlewares base
    this.mountMiddlewares();
    // montado de rutas
    this.mountRoutes();
  }

  mountMiddlewares() {
    this.expressApp.use(express.json());
    this.expressApp.use(express.urlencoded({ extended: true }));
  }

  mountRoutes() {
    this.expressApp.use("/", (req, res) => res.send("Server is healthy"));
  }

  get app() {
    return this.expressApp;
  }
}

export default new App().app;
