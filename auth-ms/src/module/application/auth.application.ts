import { InternalServerErrorException } from "../../core/exceptions/internalServer.exception";
import { Auth } from "../domain/auth";
import { ITokens } from "../domain/interfaces/tokens.interface";
import { AuthRepository } from "../domain/repositories/auth.repository";
import AuthAppService from "../domain/services/auth.service";

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

  async login(email: string, password: string): Promise<ITokens | null> {
    const authResult = await this.repositoryAuth.findOne({ email });

    // Verificamos si ocurrió un error durante la query a la bdd ó una excepcion
    if (authResult.isErr()) {
      console.log("Database error during login:", authResult.error.message);

      return null;
    }

    const auth = authResult.value;
    // Si no se encontró ningún usuario con ese email, auth será null
    if (!auth) {
      // Usuario no encontrado -> retorna null
      return null;
    }

    // Comparar la contraseña proporcionada con la contraseña almacenada (hash)
    const isMatchPassword = await AuthAppService.isMatchPassword(password, auth.getPassword());

    // Contraseña incorrecta
    if (!isMatchPassword) {
      return null;
    }

    // Contraseña correcta
    const tokens: ITokens = {
      accessToken: AuthAppService.generateAccessToken(auth.getId(), auth.getName()), // JWT de acceso
      refreshToken: auth.getRefreshToken()
    };

    // Retornamos los tokens
    return tokens;
  }

  async getNewAccessToken(refreshToken: string) {
    const authResult = await this.repositoryAuth.findOne({ refreshToken });

    // Verificar si hubo error en la query de bdd
    if (authResult.isErr()) {
      throw new InternalServerErrorException(authResult.error.message);
    }

    const auth = authResult.value;
    if (!auth) return null;

    // Generarle los tokens nuevos
    const newAccessToken = AuthAppService.generateAccessToken(auth.getId(), auth.getName());
    const newRefreshToken = AuthAppService.generateRefreshToken();

    // Actualizar el token de refresco actual en la bdd para mantener la seguridad
    const updateResult = await this.repositoryAuth.update({ id: auth.getId() }, { refreshToken: newRefreshToken });

    // Verificamos si hubo error al actualizar
    if (updateResult.isErr()) {
      throw new InternalServerErrorException(updateResult.error.message);
    }

    // Retornamos los tokens generados al cliente
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async validateAccessToken(token: string) {
    return AuthAppService.validateAccessToken(token);
  }
}
