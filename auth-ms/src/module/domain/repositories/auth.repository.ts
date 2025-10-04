import { Result } from "neverthrow";
import { Auth } from "../auth";
import { IError } from "../../../core/exceptions/error.exception";
import { AuthProps, AuthResult } from "../types/auth.type";

// Repository: Dejas el contrato de los casos de uso a implementar
export interface AuthRepository {
  register(auth: Auth): Promise<AuthResult>;

  // type-safe
  findOne(where: Partial<AuthProps>): Promise<Result<Auth | null, IError>>;

  // type-safe
  update(where: Partial<AuthProps>, data: Partial<AuthProps>): Promise<Result<Auth | null, IError>>;
}
