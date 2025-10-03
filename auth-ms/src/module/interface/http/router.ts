import express from "express";

import Controller from "./auth.controller";

import { RegisterValidator } from "../validators/register.validator";
import { validator } from "../../../core/middlewares/validator";

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
  }

  get router() {
    return this.expressRouter;
  }
}
