import { Request, Response, NextFunction } from "express";

// Definimos un tipo personalizado para middlewares en Express
// Estos son los parámetros que siempre un middleware recibe:
// req: solicitud del cliente
// res: la respuesta del servidor
// next: función que indica a Express que debe continuar con un siguiente middleware
export type middleware = (req: Request, res: Response, next: NextFunction) => void;
