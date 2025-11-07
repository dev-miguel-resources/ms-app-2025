import { Result } from "neverthrow";
import { IError } from "../../../core/exceptions/error.exception";
import { Payment } from "../Payment";

export type PaymentResult = Result<Payment, IError>;
