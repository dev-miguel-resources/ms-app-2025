import express, { Application } from "express";
import { Request, Response } from "express";
import AuthRouter from "./module/interface/http/router";
import Controller from "./module/interface/http/auth.controller";
import { AuthApplication } from "./module/application/auth.application";
import { AuthInfraestructure } from "./module/infraestructure/auth.infraestructure";

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
    const repository = new AuthInfraestructure();
    const application = new AuthApplication(repository);
    const controller = new Controller(application);
    const router = new AuthRouter(controller);

    this.expressApp.use("/auth", router.router);
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
