import { Result } from "neverthrow";
import { Auth } from "../auth";
import { IError } from "../../../core/exceptions/error.exception";
import { AuthResult } from "../types/auth.type";

// Repository: Dejas el contrato de los casos de uso a implementar
export interface AuthRepository {
  register(auth: Auth): Promise<AuthResult>;

  //findOne(where: { [s: string]: string }): Promise<any>;

  //update(where: { [s: string]: string }, data: { [s: string]: string }): Promise<any>;
}
