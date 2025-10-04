import { Request, Response } from "express";
import { AuthApplication } from "../../application/auth.application";
import { AuthFactory, ValidationError } from "../../domain/auth.factory";
import { ITokens } from "../../domain/interfaces/tokens.interface";

export default class {
  constructor(private readonly app: AuthApplication) {
    // Design Pattern: Prototype, Bind
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.validateAccessToken = this.validateAccessToken.bind(this);
    this.getNewAccessToken = this.getNewAccessToken.bind(this);
  }

  async register(req: Request, res: Response) {
    try {
      // Extraer los datos enviados desde el cliente
      const { name, email, password } = req.body;
      console.log("register", req.body);

      // Acá hacemos uso de las verificaciones de reglas de negocio para la factoria
      const auth = await AuthFactory.create(name, email, password);

      // Registramos el usuario en la bdd a través de la capa de aplicación
      const authSaved = await this.app.register(auth);

      // Retorno existoso
      res.status(201).json({ status: "ok", user: authSaved });
    } catch (error) {
      if (error instanceof Error) {
        // Verificamos si el error viene de la factory
        const validationErrors: ValidationError[] = (error as any).validationErrors || [];
        console.log(error);

        if (validationErrors.length > 0) {
          return res.status(400).json({ status: "error", errors: validationErrors });
        }

        // Si es un error conocido
        return res.status(400).json({ status: "error", message: error.message });
      }

      // Para errores internos del servidor (errores desconocidos)
      res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Llamamos a la capa de aplicación para intentar autenticar al usuario
      const tokens: ITokens | null = await this.app.login(email, password);

      // Si no se devuelven los tokens, significa que el email o el pass son incorrectos
      if (!tokens) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Login existoso: enviamos los tokens al cliente con status 200 OK
      return res.status(200).json(tokens);
    } catch (error) {
      console.log("Login error: ", error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async validateAccessToken(req: Request, res: Response) {
    const { token } = req.body;

    try {
      // Llamar a la capa de app para validar el token de acceso
      // esto revisa: que el token sea auténtico -> si viene con la firma
      // que no haya expirado
      // Devuelve el payload con los datos si es válido (información del usuario)
      const payload = await this.app.validateAccessToken(token);

      res.json(payload);
    } catch (error) {
      // Si ocurre un error (token inválido, expirado, mal formado, etc...)
      res.status(error.status).json(error.message);
    }
  }

  async getNewAccessToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      // Si no se envía el refresh Token, retornamos un error 400 (Bad Request)
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }

      // Llamamos a la capa de application para generar un nuevo access token usando el refresh token
      const tokens = await this.app.getNewAccessToken(refreshToken);

      // Si no se devuelve ningún token, es porque el refresh token es inválido
      if (!tokens) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      // Si todo es correcto devolvemos el nuevo token de acceso
      return res.status(200).json(tokens);
    } catch (error) {
      console.log("Error in getNewAccessToken", error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
