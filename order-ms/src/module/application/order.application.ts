import { InternalServerErrorException } from "../../core/exceptions/internalServer.exception";
import { Order } from "../domain/Order";
import { BrokerRepository } from "../domain/repositories/broker.repository";
import { OrderRepository } from "../domain/repositories/order.repository";

export class OrderApplication {
  private repositoryOrder: OrderRepository;
  private repositoryBroker: BrokerRepository;

  constructor(repository: OrderRepository, repositoryBoker: BrokerRepository) {
    this.repositoryOrder = repository;
    this.repositoryBroker = repositoryBoker;
  }

  async save(order: Order): Promise<Order> {
    const orderResult = await this.repositoryOrder.save(order);

    if (orderResult.isErr()) {
      throw new InternalServerErrorException(orderResult.error.message);
    }

    // Si se guarda correctamente, envía la orden al broker
    await this.repositoryBroker.sent(orderResult.value);

    return orderResult.value;
  }

  // método adicional
}
