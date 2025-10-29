// Esto permite crear errores personalizados con propiedades adicionales.
export class IError extends Error {
  status?: number;
}
