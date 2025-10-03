import { InternalServerErrorException } from "../../core/exceptions/internalServer.exception";
import { Auth } from "../domain/auth";
import { AuthRepository } from "../domain/repositories/auth.repository";

export class AuthApplication {
  private repositoryAuth: AuthRepository;

  // El constructor recibe el repositorio como depedencia (Inversión de depedencia)
  constructor(repositoryAuth: AuthRepository) {
    this.repositoryAuth = repositoryAuth;
  }

  // Método para registrar un nuevo usuario
  async register(auth: Auth): Promise<Auth> {
    const authResult = await this.repositoryAuth.register(auth);

    if (authResult.isErr()) {
      console.error("Database error:", authResult.error.message);

      throw new InternalServerErrorException(authResult.error.message);
    }

    return authResult.value;
  }
}
