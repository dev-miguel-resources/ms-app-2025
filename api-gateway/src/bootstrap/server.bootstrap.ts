import http from "http";

// recibir mi app

import { Bootstrap } from "./bootstrap";
import app from "../app";

// Principio SOLID: Single Responsability
// Principio SOLID: Liskov
export default class ServerBootstrap extends Bootstrap {
  initialize(): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      const port = process.env.PORT || 5000;

      const server = http.createServer(app);

      server
        .listen(port)
        .on("listening", () => {
          resolve(true);
          console.log(`Server listening on ${port}`);
        })
        .on("error", err => {
          reject(err);
          console.log("Server failed to Start");
        });
    });
  }
}
