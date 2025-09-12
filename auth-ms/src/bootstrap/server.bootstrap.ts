import http from "http";

// importación de app
import app from "../app";

import { Bootstrap } from "./bootstrap";

// Single Responsability
// Liskov Sustitution
export default class ServerBootstrap extends Bootstrap {
  initialize(): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      const port = process.env.PORT || 4000;

      const server = http.createServer(app);

      server
        .listen(port)
        .on("listening", () => {
          resolve(true);
          console.log(`Server is listening on ${port}`);
        })

        .on("error", err => {
          reject(err);
          console.log("Server failed to start");
        });
    });
  }
}
