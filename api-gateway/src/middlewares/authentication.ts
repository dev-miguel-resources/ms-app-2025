import axios, { AxiosRequestConfig } from "axios";
import { Request, Response, NextFunction } from "express";
import AppService from "../services/app.service";
import jwt_decode from "jwt-decode";

// Verificamos si existe o no el header Authorization que es donde se manda el token
const existsHeaderAuthorization = (req: Request): boolean => {
  return !!req.headers.authorization;
};

// Verificar que el header tenga el formato correcto: "Bearer <token>"
const isFormatRight = (req: Request): boolean => {
  // Ej split: "Bearer jwt-token" -> ["Bearer", "jwt-token"]
  // req.headers.authorization = "Bearer jwt-token"
  const parts = req.headers.authorization.split(" ");
  return parts?.length !== 2 || parts[0] !== "Bearer" ? false : true;
};

// Llamar al microservicio Auth-ms para validar el token
const isAccessTokenValid = async (req: Request): Promise<boolean> => {
  const accessToken = req.headers.authorization.split(" ")[1];

  // armar la solicitud
  const request: AxiosRequestConfig = {
    method: "POST",
    url: `${AppService.PATH_AUTH}/auth/validate-access-token`,
    responseType: "json",
    data: { token: accessToken } // {"token": "jwt-token"}
  };

  try {
    // Enviamos la solicitud al microservicio de autenticación
    const result = await axios(request);
    // Interpretar la respuesta. Se espera que el microservicio de auth devuelva algo como: { "valid": true }
    return result.data?.valid ? true : false;
    // Si axios lanza un error (ej: el ms no responde, token invalido) se captura
  } catch (err) {
    console.log("error", err);
    return false;
  }
};

// Decode-Decodificar el JWT para obtener el userId y eso lo guardamos en res.locals
const setUserId = (req: Request, res: Response) => {
  const accessToken = req.headers.authorization.split(" ")[1] as string;
  try {
    const payload: any = jwt_decode(accessToken);

    res.locals.userId = payload.userId;
  } catch (err) {
    console.log("error setUserId", err);
  }
};

// Middleware principal de autenticación
export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Verificar la existencia y formato del header
  if (!existsHeaderAuthorization(req) || !isFormatRight(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Si pasa esta verificación, el middleware continua siguientes procesos:
  console.log("header authorization exists");

  // 2. Verificar la validez del access token
  if (!(await isAccessTokenValid(req))) {
    // Si el token no es válido, responda con un 401 y no continúe.
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log("access token is valid");

  // 3. Decodificar el token y le asignamos la referencia del userId
  setUserId(req, res);

  // 4. Dejamos la continuidad activada hacia siguientes middlewares o cierre de la ejecución
  next();
};
