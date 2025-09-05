import axios, { AxiosRequestConfig } from "axios";

import express, { Request, Response } from "express";
import { Routes } from "./interfaces/route.type";
import { authentication } from "./middlewares/authentication";
import { Route } from "./interfaces/routeProps.interface";
import AppService from "./services/app.service";

class App {
  readonly expressApp: any;

  // Vamos a definir una especificación centralizada de las que rutas que maneja el API Gateway
  private readonly routes: Routes = [
    {
      origin: "/api/order", // endpoint del gateway
      target: `${AppService.PATH_ORDER}/order`, // endpoint real del microservicio
      method: "POST",
      middlewares: [authentication] // middleware que requiere verificar la autenticación
    },
    {
      origin: "/api/auth/register",
      target: `${AppService.PATH_AUTH}/auth/register`,
      method: "POST",
      middlewares: []
    },
    {
      origin: "/api/auth/login",
      target: `${AppService.PATH_AUTH}/auth/login`,
      method: "POST",
      middlewares: []
    },
    {
      origin: "/api/auth/get-new-access-token",
      target: `${AppService.PATH_AUTH}/auth/get-new-access-token`,
      method: "POST",
      middlewares: []
    }
  ];

  constructor() {
    // Inicializamos la app de Express
    this.expressApp = express();

    // Montar middlewares globales al servidor
    this.mountMiddlewares();

    // Montar rutas definidas en el API Gateway
    this.mountRoutes();
  }

  // Configuración de middlewares globales de Express
  mountMiddlewares() {
    // Permite trabajar con JSON en los request donde se trabaje con el body
    this.expressApp.use(express.json());

    // Permite trabajar con datos codificados/cifrados en los textos donde se envía data (forms)
    this.expressApp.use(express.urlencoded({ extended: true }));
  }

  // Haría el registro dinámico de todas las rutas declaradas en mi this.routes
  mountRoutes(): void {
    console.log("this.routes", this.routes);
    // Recorrer cada ruta definida y la monta en mi servidor con Express
    this.routes.forEach(route => {
      const { origin, middlewares } = route;
      const method = route.method.toLowerCase();

      // Asociar la ruta al método HTTP de express
      this.expressApp[method](origin, ...middlewares, this.execute(route));
    });

    // Ruta básica de healthcheck
    this.expressApp.get("/", (req: Request, res: Response) => {
      res.send("Server is healthy");
    });
  }

  // Método que define como el Gateway resuelve las llamadas hacia los microservicios
  execute(route: Route) {
    return async (req: Request, res: Response) => {
      // Generar la construcción de la petición HTTP que será enviada al microservicio
      const request: AxiosRequestConfig<unknown> = {
        method: route.method,
        url: route.target,
        responseType: "json",
        data: { ...req.body } // se reenvía el body recibido
      };

      console.log("request", request);

      try {
        // Llamada al microservicio usando axios
        const result = await axios(request);

        // Respuesta del microservicio resultante
        res.json(result.data);
      } catch (error) {
        res.json({ error });
      }
    };
  }
}

// Exporte la app de express ya inicilizada
export default new App().expressApp;
