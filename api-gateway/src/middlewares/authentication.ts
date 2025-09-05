import axios, { AxiosRequestConfig } from "axios";
import { Request, Response, NextFunction } from "express";
import AppService from "../services/app.service";

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
const setUserId = (req: Request, res: Response) => {};

// Middleware principal de autenticación
export const authentication = async (req: Request, res: Response, next: NextFunction) => {};
