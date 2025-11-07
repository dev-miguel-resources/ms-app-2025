import { Payment } from "../Payment";
import { PaymentResult } from "../types/paymentResult.type";

export interface PaymentRepository {
  save(payment: Payment): Promise<PaymentResult>;
}
