import { Result } from "neverthrow";
import { IError } from "../../../core/exceptions/error.exception";
import { Order } from "../Order";

export type OrderResult = Result<Order, IError>;
