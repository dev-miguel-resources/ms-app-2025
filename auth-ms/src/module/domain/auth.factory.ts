import { Auth } from "./auth";

import { v4 as uuidv4 } from "uuid";
import AuthAppService from "./services/auth.service";

export interface ValidationError {
  field: string;
  message: string;
}

// Design Pattern Factory
export class AuthFactory {
  static patternEmail: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  // Nuevo patrón para validar contraseñas fuertes
  static patternPassword: string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$";

  static async create(name: string, email: string, password: string): Promise<Auth> {
    const errors: ValidationError[] = [];

    // Validación: El nombre debe tener al menos 3 caracteres
    if (name.trim().length < 3) {
      errors.push({ field: "name", message: "Name must be at least 3 characters" });
    }

    // Validación: el email debe coincidir con el patrón definido.
    if (!email.match(AuthFactory.patternEmail)) {
      errors.push({ field: "email", message: "Invalid email address" });
    }

    // Validación: el password debe tener al menos 6 caracteres
    if (password.trim().length < 6) {
      errors.push({ field: "password", message: "Name must be at least 6 characters" });
    }

    if (!password.match(AuthFactory.patternPassword)) {
      errors.push({
        field: "password",
        message: "Password must contain at least one uppercase, one lowercase, one number and one special character"
      });
    }

    // Si hay errores, lanzamos todos juntos como un objeto Error con una propiedad llamada "validationErrors"
    if (errors.length > 0) {
      const error = new Error("Validation failed");
      (error as any).validationErrors = errors;
      throw error;
    }

    // Generar un ID único como string
    const id = uuidv4();

    // Definiciones de la generación del token
    const refreshToken = AuthAppService.generateRefreshToken();

    // Definiciones del password asociado a un cifrado de hash
    const passwordHash = await AuthAppService.cipherPassword(password);

    // Finalmente, recibas tu instancia Auth con todos los valores procesados correctamente
    return new Auth(id, name, email, passwordHash, refreshToken);
  }
}
