import mongoose from "mongoose";

import { Bootstrap } from "./bootstrap";

export default class DatabaseBootstrap extends Bootstrap {
  initialize(): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      // Definiciones del username de bdd
      const username = process.env.USERNAME || "root";
      // Definición del password
      const password = process.env.PASSWORD || "root";
      // Definir el nombre de la bdd
      const database = process.env.DATABASE || "test";
      // Definir el host del servidor de MongoDB
      const host = process.env.MONGO_HOST || "localhost";
      // Definir el puerto de conexión
      const port = process.env.PORT || 27017;
      // Definir utilizar la bdd de verificación de credenciales
      const authSource = process.env.MONGO_AUTH_SOURCE || "admin";

      // Construir la url de conexión con todos los parámestros anteriores.
      // Ej: mongodb://<username>:<password>@<host>:<port>/db?authSource=<authSource>
      const url = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=${authSource}`;

      // Definir una opción de conexión. Cuantas conexiones disponibles puede tener asociada esta bdd.
      const options = { maxPoolSize: 10 };

      const cb = (err: Error) => {
        if (err) {
          console.log("Database failed to start");
          return reject(err);
        }
        // Si la conexión fue exitosa y resolvemos la promesa con true
        console.log("Database started");
        resolve(true);
      };

      mongoose.connect(url, options, cb);
    });
  }
}
