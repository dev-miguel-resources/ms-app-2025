import { Result } from "neverthrow";

import { Auth } from "../auth";
import { IError } from "../../../core/exceptions/error.exception";

export type AuthResult = Result<Auth, IError>;

export type AuthProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  refreshToken: string;
};
