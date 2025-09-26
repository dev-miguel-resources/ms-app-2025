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
    // Llamamos al repositorio para persistir la entidad Auth.
    const authResult = await this.repositoryAuth.register(auth);

    // Si ocurre un error en la persistencia, lanzamos la excepción interna
    if (authResult.isErr()) {
      throw new InternalServerErrorException(authResult.error.message);
    }

    // Si todo está bien, retornamos la entidad creada.
    return authResult.value;
  }
}
