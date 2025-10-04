import { err, ok, Result } from "neverthrow";
import { Auth } from "../domain/auth";
import Model from "./models/auth.model";
import { IError } from "../../core/exceptions/error.exception";
import { AuthRepository } from "../domain/repositories/auth.repository";
import { AuthProps, AuthResult } from "../domain/types/auth.type";

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

  async findOne(where: Partial<AuthProps>): Promise<Result<Auth | null, IError>> {
    try {
      const auth = await Model.findOne(where);

      return ok(auth ? new Auth(auth.id, auth.name, auth.email, auth.password, auth.refreshToken) : null);
    } catch (error) {
      // Errores de proceso
      if (error instanceof IError) {
        const resultErr = new IError(error.message);
        resultErr.status = 500;
        return err(resultErr);
      }

      // Errores desconocidos
      const resultErr = new IError("Unknown error ocurred");
      resultErr.status = 500;
      return err(resultErr);
    }
  }

  async update(where: Partial<AuthProps>, data: Partial<AuthProps>): Promise<Result<Auth | null, IError>> {
    try {
      // Buscar un documento que cumpla con la condición del where y lo actualice con la data
      // new: true -> devuelve un documento actualizado en lugar del original
      // - runValidators: true -> aplique las validaciones propias del esquema de Mongoose
      const updatedDoc = await Model.findOneAndUpdate(where, data, {
        new: true,
        runValidators: true
      });

      // Si no se encontró ningún documento para actualizar, retornamos un ok(null)
      if (!updatedDoc) return ok(null);

      // Convertimos el documento actualizado en una entidad Auth
      const updatedAuth = new Auth(
        updatedDoc.id,
        updatedDoc.name,
        updatedDoc.email,
        updatedDoc.password,
        updatedDoc.refreshToken
      );

      return ok(updatedAuth);
    } catch (error) {
      const resultErr = new IError(error instanceof Error ? error.message : "Unkown error");
      resultErr.status = 500;

      return err(resultErr);
    }
  }
}
