import amqp from "amqplib";

// Servicio para confirmar la recepción de mensajes en Rabbit MQ
/*
 * Método que confirma (ack) un mensaje recibido
 * channel: el canal de comunicación donde se recibió el mensaje
 * message: el mensaje que se desea confirmar
 */
export default class UtilsConfirmBrokerService {
  static confirmMessage(channel: amqp.Channel, message: amqp.Message) {
    // Envía la confirmación de recepción del mensaje al broker
    // Esto evita que el mensaje se vuelva a entregar a otros consumidores
    channel.ack(message);
  }
}
