import { middleware } from "./middleware.type";

export interface Route {
  // Ruta de origen expuesta por el api Gateway
  // ej: "/api/order"
  origin: string;
  // URL de destino del microservicio al que se redirige la petición
  // ej: "http://order-ms:3500/order"
  target: string;
  // La definición del verbo HTTP permitido para esa ruta
  method: "POST";
  // Lista de middlewares a aplicar antes de ejecutar la redirección al ms
  // ej: [authentication]
  middlewares: middleware[];
}
