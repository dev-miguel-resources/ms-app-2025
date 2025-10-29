import amqp from "amqplib";

export default class ReceiveMessageService {
  // Método para consumir mensajes de ordenes confirmadas o rechazadas por un exchange
  /*
   * channel: canal de comunicación con Rabbit MQ por el que se recibirán los mensajes.
   * cb: callback que se ejecuta cuando llega un mensaje.
   * exchangeName: nombre del intercambiador en Rabbit MQ.
   * exchangeType: tipo del intercambiador.
   * routingKey: clave de enrutamiento para filtrar los mensajes que interesan.
   */
  static async paymentConfirmedOrRejected(
    channel: amqp.Channel,
    cb: (message: unknown) => void,
    exchangeName: string,
    exchangeType: string,
    routingKey: string | string[]
  ) {
    // Asegurarnos de que el exchange exista, si no, lo crea con una configuración.
    await channel.assertExchange(exchangeName, exchangeType, { durable: true });

    // Crear una cola y que sea exclusiva para este consumidor.
    // exclusive: true, significa que la cola se elimina cuando se cierra el canal/cliente.
    const assertQueue = await channel.assertQueue("", { exclusive: true });

    // Si se pasan varias routing keys, enlaza la cola a cada clave para recibir los mensajes.
    if (Array.isArray(routingKey)) {
      routingKey.forEach(key => {
        channel.bindQueue(assertQueue.queue, exchangeName, key);
      });
    } else {
      // Si se pasa solo una routing key, se enlaza directamente
      channel.bindQueue(assertQueue.queue, exchangeName, routingKey);
    }

    // Comenzar a consumir mensajes de la cola.
    // Cada mensajes recibido se pasa al callback (cb)
    // noAck: false. Indica que el consumidor debe confirmar manualmente la recepción del mensaje (ack)
    channel.consume(assertQueue.queue, message => cb(message), {
      noAck: false
    });
  }

  /*
   * Método para consumir mensajes directamente de una cola específica.
   */

  static async accept(channel: amqp.Channel, queue_name: string, cb: (message: unknown) => void) {
    // Asegurar que la cola exista
    await channel.assertQueue(queue_name, { durable: true });

    // Comienza a consumir mensajes de la cola y ejecuta el callback por cada mensaje
    channel.consume(queue_name, message => cb(message), { noAck: false });
  }
}
