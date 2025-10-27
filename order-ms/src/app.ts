import express, { Application } from "express";
import { Request, Response } from "express";
import { OrderRepository } from "./module/domain/repositories/order.repository";
import { OrderInfraestructure } from "./module/infraestructure/order.infraestructure";
import { BrokerRepository } from "./module/domain/repositories/broker.repository";
import { BrokerInfraestructure } from "./module/infraestructure/broker.infraestructure";
import { OrderApplication } from "./module/application/order.application";
import Controller from "./module/interface/http/order.controller";
import OrderRouter from "./module/interface/http/router";

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
    const infraestructure: OrderRepository = new OrderInfraestructure();
    const broker: BrokerRepository = new BrokerInfraestructure();
    const application = new OrderApplication(infraestructure, broker);
    const controller = new Controller(application);
    const router = new OrderRouter(controller);

    this.expressApp.use("/order", router.router);
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
