import { BrokerRepository } from "../domain/repositories/broker.repository";

// Necesito traerme la clase que tiene la conexión del Broker y que me facilita el canal.
import BrookerBootstrap from "../../bootstrap/broker.bootstrap";

// Servicio para recibir mensajes desde Rabbit MQ
import ReceiveMessageService from "./services/receive-message.service";

// Servicio para confirmar mensajes recibidos en RabbitMQ
import UtilsConfirmBrokerService from "./services/utils-confirm-broker.service";

// Traerme el tipo Message de amqlib, esto representa un mensaje de RabbitMQ
import { Message } from "amqplib";

// Modelo de bdd
import Model from "./models/order.model";

export class BrokerInfraestructure implements BrokerRepository {
  // Método para enviar un mensaje a la cola de órdenes.
  async sent(message: unknown): Promise<unknown> {
    const channel = BrookerBootstrap.channel; // Obtenemos el canal de la conexión.
    const queueName = process.env.QUEUE_NAME || "order"; // Cola de destino
    await channel.assertQueue(queueName, { durable: true }); // existencia de la cola.
    // Envia el mensaje a la cola con un formato: Buffer
    return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }

  // Método para configurar la recepción de mensajes desde los intercambiadores de Rabbit MQ.
  async receive(): Promise<unknown> {
    const channel = BrookerBootstrap.channel;

    // Configuraciones para mensajes rechazados
    const exchangeNameReject = process.env.EXCHANGE_NAME_REJECT || "exchange-reject";
    const exchangeTypeReject = process.env.EXCHANGE_TYPE_REJECT || "topic";
    const routingKeyReject = process.env.ROUTING_KEY_REJECT || "*.error";

    // Escucha mensajes de órdenes rechazadas y ejecutar consumerReject
    await ReceiveMessageService.orderConfirmedOrRejected(
      channel,
      this.consumerReject.bind(this),
      exchangeNameReject,
      exchangeTypeReject,
      routingKeyReject
    );

    // Configuración para mensajes de órdenes confirmadas
    const exchangeName = process.env.EXCHANGE_NAME || "exchange-order";
    const exchangeType = process.env.EXCHANGE_TYPE || "fanout";
    const routingKey = process.env.ROUTING_KEY || "";

    // Escucha mensajes de órdenes confirmadas y ejecuta consumerOrderConfirmed
    return await ReceiveMessageService.orderConfirmedOrRejected(
      channel,
      this.consumerOrderConfirmed.bind(this),
      exchangeName,
      exchangeType,
      routingKey
    );
  }

  // Método para procesar mensajes de órdenes confirmadas
  async consumerOrderConfirmed(message: any) {
    // Parse del contenido del mensaje
    const messageParse = JSON.parse(message.content.toString());
    const { transactionId } = messageParse;

    // Buscar la orden en la bdd por transactionId
    const order = await Model.findOne({ transactionId });

    if (order) {
      // Actualizar el status de la orden a "APPROVED"
      await Model.updateOne({ transactionId }, { status: "APPROVED" });
    }

    // Confirmar la recepción del mensaje en RabbitMQ para que no se reprocese
    BrookerBootstrap.channel.ack(message);
  }

  // Método que procesa mensajes de órdenes rechazadas
  async consumerReject(message: Message) {
    const content = JSON.parse(message.content.toString());

    // Actualizar la orden a "CANCELLED"
    await Model.updateOne({ transactionId: content.transactionId }, { status: "CANCELLED" });

    // Confirmar la recepción del mensaje utilizando el utilitario.
    UtilsConfirmBrokerService.confirmMessage(BrookerBootstrap.channel, message);
  }
}
