import { Message } from "amqplib";
import BrookerBootstrap from "../../bootstrap/broker.bootstrap";
import { BrokerRepository } from "../domain/repositories/broker.repository";
import ReceiveMessageService from "./services/receive-message.service";
import Model from "./models/payment.model";
import UtilsConfirmBrokerService from "./services/utils-confirm-broker.service";

export class BrokerInfraestructure implements BrokerRepository {
  // envío a tu cola asociado desde este ms
  async sent(message: unknown): Promise<unknown> {
    const channel = BrookerBootstrap.channel;
    const queueName = process.env.QUEUE_NAME || "payment";
    await channel.assertQueue(queueName, { durable: true });
    return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }

  // verificar si el consumo de la cola previa se realizó bien o no.
  async receive(): Promise<unknown> {
    const channel = BrookerBootstrap.channel;
    // Referencia de la cola anterior
    const queueName = process.env.QUEUE_NAME_RECEIVE_ORDER || "queue-order-created";
    await ReceiveMessageService.accept(channel, queueName, this.consumerAccept.bind(this));

    const exchangeNameReject = process.env.EXCHANGE_NAME_REJECT || "exchange-reject";
    const exchangeTypeReject = process.env.EXCHANGE_TYPE_REJECT || "topic";

    const routingKeyReject = process.env.ROUTING_KEY_REJECT.split(",") || ["delivery.error", "store.error"];

    console.log("RoutingKeyRejected", routingKeyReject);

    await ReceiveMessageService.orderConfirmedOrRejected(
      channel,
      this.consumerReject.bind(this),
      exchangeNameReject,
      exchangeTypeReject,
      routingKeyReject
    );

    const exchangeName = process.env.EXCHANGE_NAME || "exchange-order";
    const exchangeType = process.env.EXCHANGE_TYPE || "fanout";
    const routingKey = process.env.ROUTING_KEY || "";

    return await ReceiveMessageService.orderConfirmedOrRejected(
      channel,
      this.consumerOrderConfirmed.bind(this),
      exchangeName,
      exchangeType,
      routingKey
    );
  }

  // formato de aceptación de recuperación de datos desde otra cola para poderla ocupar y consumir
  async consumerAccept(message: Message) {
    const content = JSON.parse(message.content.toString());
    // Acá es donde luego de aceptar un mensaje de una cola x, lo pueden consumir para luego pasarlo a la cola respectiva
    // procesar esa data mediante la lógica de integración con algún servicio: paypal, mercado pago, etc...
    await Model.create(content);
    UtilsConfirmBrokerService.confirmMessage(BrookerBootstrap.channel, message);
    this.sent(content);
  }

  // resolvemos y confirmar los rechazos
  async consumerReject(message: Message) {
    const content = JSON.parse(message.content.toString());
    await Model.updateOne({ transactionId: content.transactionId }, { status: "CANCELLED" });
    UtilsConfirmBrokerService.confirmMessage(BrookerBootstrap.channel, message);
  }

  // éxito y confirmación manual
  async consumerOrderConfirmed(message: Message) {
    const messageParse = JSON.parse(message.content.toString());
    const { transactionId } = messageParse;
    const order = await Model.findOne({ transactionId });

    if (order) {
      await Model.updateOne({ transactionId }, { status: "APPROVED" });
    }

    BrookerBootstrap.channel.ack(message);
  }
}
