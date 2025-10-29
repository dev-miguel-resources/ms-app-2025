export interface BrokerRepository {
  // Representa la operación de "enviar" un mensaje al broker.
  sent(message: unknown): Promise<unknown>;

  // Representa la operación de "recibir" un mensaje desde el broker
  receive(): Promise<unknown>;
}
