import { validate } from "class-validator";

import express, { Request, Response, NextFunction } from "express";

export function validator(instance: Object) {
  // Devolver un middleware que valida el cuerpo de la request
  return async (req: Request, res: Response, next: NextFunction) => {
    // Pasar todo el cuerpo del request a la instancia del validador
    Object.assign(instance, req.body);

    // Ejecutar las validaciones sujetas en los decoradores de clase de los DTOS
    const errors = await validate(instance);

    // Ver si hay errores de validación
    if (errors.length > 0) {
      // Extraer los mensajes de cada error (err.constraints) y los pasamos en un array
      const messages = errors.map(err => Object.values(err.constraints || {})).flat();

      // Devolver una respuesta http con status 400 con los mensajes de validación
      return res.status(400).json({ error: "Invalid request", messages });
    }

    // Si no hay errores saltamos al middleware siguiente
    next();
  };
}
