import express from "express";

import Controller from "./auth.controller";

import { RegisterValidator } from "../validators/register.validator";
import { validator } from "../../../core/middlewares/validator";
import { LoginValidator } from "../validators/login.validator";
import { RefreshTokenValidator } from "../validators/refresh-token.validator";
import { TokenValidator } from "../validators/token.validator";

export default class {
  private readonly expressRouter: express.Router;

  constructor(private readonly controller: Controller) {
    this.expressRouter = express.Router();
    this.mountRoutes();
  }

  mountRoutes() {
    // Design Pattern: Chain of Responsability
    this.expressRouter.post(
      "/register",
      validator(new RegisterValidator()), // validar los datos del registro
      this.controller.register
    );
    this.expressRouter.post(
      "/login",
      validator(new LoginValidator()), // validar los datos del registro
      this.controller.login
    );

    this.expressRouter.post(
      "/validate-access-token",
      validator(new TokenValidator()), // validar los datos del registro
      this.controller.validateAccessToken
    );

    this.expressRouter.post(
      "/get-new-access-token",
      validator(new RefreshTokenValidator()), // validar los datos del registro
      this.controller.getNewAccessToken
    );
  }

  get router() {
    return this.expressRouter;
  }
}
