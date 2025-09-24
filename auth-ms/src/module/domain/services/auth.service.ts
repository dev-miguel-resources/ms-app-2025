import bcrypt from "bcryptjs";

import jwt from "jwt-simple";

import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export default class AuthAppService {
  static generateAccessToken(id: string, name: string): string {
    // Generar el contenido interno del token
    const payload = {
      id,
      name,
      iat: moment().unix(),
      exp: moment()
        .add(process.env.JWT_EXPIRES || 120, "seconds")
        .unix()
    };

    return jwt.encode(payload, process.env.JWT_SECRET || "secret");
  }

  // Para generar tokens únicos universales
  static generateRefreshToken(): string {
    return uuidv4();
  }

  static validateAccessToken(token: string) {
    return new Promise((resolve, reject) => {
      try {
        // Decodificar el token usando la llave secreta de su creación
        const payload = jwt.decode(token, process.env.JWT_SECRET || "secret");

        console.log(payload);

        // Si el token es válido, resolvemos la promesa exitosamente con el payload
        resolve(payload);
      } catch (error) {
        // Si ocurre un error (token invalido o expirado) lo imprimimos.
        console.log(error);

        // Si el error indica que el token expiró, se rechaza con un mensaje determinado.
        if (error.message === "Token expired") {
          reject({
            status: 409,
            message: "The token has expired"
          });
        } else {
          // Si es otro tipo de error, se rechaza con un mensaje de token inválido
          reject({
            status: 401,
            message: "Invalid token"
          });
        }
      }
    });
  }

  // Cifrar el password
  static async cipherPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // Verificar la comparación de passwords
  static async isMatchPassword(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }
}
