import { BrokerRepository } from "../domain/repositories/broker.repository";

// Necesito traerme la clase que tiene la conexión del Broker y que me facilita el canal.
import BrookerBootstrap from "../../bootstrap/broker.bootstrap";

// Servicio para recibir mensajes desde Rabbit MQ

// Servicio para confirmar mensajes recibidos en RabbitMQ

// Traerme el tipo Message de amqlib, esto representa un mensaje de RabbitMQ
import { Message } from "amqplib";

// Modelo de bdd
import Model from "./models/order.model";

export class BrokerInfraestructure implements BrokerRepository {
  async sent(message: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  async receive(): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
}
