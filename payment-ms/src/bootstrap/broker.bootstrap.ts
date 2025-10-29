import amqp from "amqplib";

import { Bootstrap } from "./bootstrap";

export default class BrookerBootstrap extends Bootstrap {
  static channel: amqp.Channel;

  initialize(): Promise<boolean | Error> {
    return new Promise(async (resolve, reject) => {
      const host = process.env.RABBITMQ_HOST || "localhost:5672";

      try {
        // 1. Si se conecta al servidor de Rabbit MQ usando el protocolo "amqp://"
        // Por ej: amqp://localhost:5672 ó amqp://rabbitmq:5672
        const connection = await amqp.connect(`amqp://${host}`);

        // 2. Crear un canal de comunicación para la conexión.
        // Los channel son la unidad lógica que permite publicar y consumir mensajes.
        BrookerBootstrap.channel = await connection.createChannel();

        // 3. Si salió todo bien, mostramos un mensaje
        console.log("Connected to RabbitMQ");
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
