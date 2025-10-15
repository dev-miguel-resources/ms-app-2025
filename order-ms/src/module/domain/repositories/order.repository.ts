import { Order } from "../Order";
import { OrderResult } from "../types/orderResult.type";

export interface OrderRepository {
  save(order: Order): Promise<OrderResult>;
}
