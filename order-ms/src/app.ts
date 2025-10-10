import express, { Application } from "express";
import { Request, Response } from "express";

class App {
  private readonly expressApp: Application;

  constructor() {
    this.expressApp = express();
    // middlewares base
    this.mountMiddlewares();
    // montado de rutas
    this.mountRoutes();
    // Rutas no encontradas
    this.mountNotFoundHanlder();
  }

  mountMiddlewares() {
    this.expressApp.use(express.json());
    this.expressApp.use(express.urlencoded({ extended: true }));
  }

  mountRoutes() {
    this.expressApp.get("/", (req: Request, res: Response) => {
      res.status(200).json({ status: "ok", message: "Server is healthy" });
    });
  }

  private mountNotFoundHanlder() {
    this.expressApp.use((req: Request, res: Response) => {
      res.status(404).json({
        status: "error",
        message: `Route ${req.originalUrl} not found`
      });
    });
  }

  get app() {
    return this.expressApp;
  }
}

export default new App().app;
