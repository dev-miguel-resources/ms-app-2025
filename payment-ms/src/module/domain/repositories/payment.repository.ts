import { Order } from "../Payment";
import { OrderResult } from "../types/paymentResult.type";

export interface OrderRepository {
  save(order: Order): Promise<OrderResult>;
}
