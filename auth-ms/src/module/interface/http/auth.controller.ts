import { Request, Response } from "express";
import { AuthApplication } from "../../application/auth.application";
import { AuthFactory, ValidationError } from "../../domain/auth.factory";

export default class {
  constructor(private readonly app: AuthApplication) {
    // Design Pattern: Prototype, Bind
    this.register = this.register.bind(this);
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
}
