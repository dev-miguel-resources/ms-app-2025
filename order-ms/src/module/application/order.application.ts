import { InternalServerErrorException } from "../../core/exceptions/internalServer.exception";
import { Order } from "../domain/Order";
import { OrderRepository } from "../domain/repositories/order.repository";

export class OrderApplication {
  private repositoryOrder: OrderRepository;

  // traerme otra instancia

  constructor(repository: OrderRepository) {
    this.repositoryOrder = repository;
  }

  async save(order: Order): Promise<Order> {
    const orderResult = await this.repositoryOrder.save(order);

    if (orderResult.isErr()) {
      throw new InternalServerErrorException(orderResult.error.message);
    }

    // falta un proceso extra

    return orderResult.value;
  }

  // método adicional
}
