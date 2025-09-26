import { err, ok } from "neverthrow";
import { Auth } from "../domain/auth";
import Model from "./models/auth.model";
import { IError } from "../../core/exceptions/error.exception";
import { AuthRepository } from "../domain/repositories/auth.repository";
import { AuthResult } from "../domain/types/auth.type";

export class AuthInfraestructure implements AuthRepository {
  async register(auth: Auth): Promise<AuthResult> {
    try {
      // Crear un nuevo registro usando el modelo de bdd.
      // Esto guarda todos los datos de la entidad Auth en la bdd.
      await Model.create(auth);
      // Esto envuelve la entidad Auth como resultado exitoso.
      return ok(auth);
    } catch (error) {
      // Si ocurre un error, lo envolvemos en un objeto IError con estado 500
      const resultErr = new IError(error.message);
      resultErr.status = 500;
      // Retornamos un resultado de error usando "err" de neverthrow
      return err(resultErr);
    }
  }
  findOne(where: { [s: string]: string }): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(where: { [s: string]: string }, data: { [s: string]: string }): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
