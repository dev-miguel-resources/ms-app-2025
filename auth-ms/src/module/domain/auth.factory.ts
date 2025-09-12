import { Auth } from "./auth";

import { v4 as uuidv4 } from "uuid";

// Design Pattern Factory
export class AuthFactory {
  static patternEmail: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  static async create(name: string, email: string, password: string): Promise<Auth> {
    // Validación: El nombre debe tener al menos 3 caracteres
    if (name.trim().length < 3) {
      throw new Error("Name must be at least 3 characters");
    }

    // Validación: el email debe coincidir con el patrón definido.
    if (!email.match(AuthFactory.patternEmail)) {
      throw new Error("Invalid email address");
    }

    // Validación: el password debe tener al menos 6 caracteres
    if (password.trim().length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Generar un ID único como string
    const id = uuidv4();

    // Definiciones de la generación del token
    const refreshToken = "jaime-token";

    // Definiciones del password asociado a un cifrado de hash
    const passwordHash = "luis-hash";

    // Finalmente, recibas tu instancia Auth con todos los valores procesados correctamente
    return new Auth(id, name, email, passwordHash, refreshToken);
  }
}
