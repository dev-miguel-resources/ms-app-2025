import BrookerBootstrap from "./bootstrap/broker.bootstrap";
import DatabaseBootstrap from "./bootstrap/database.bootstrap";
import ServerBootstrap from "./bootstrap/server.bootstrap";
import { PaymentApplication } from "./module/application/payment.application";
import { BrokerRepository } from "./module/domain/repositories/broker.repository";
import { PaymentRepository } from "./module/domain/repositories/payment.repository";
import { BrokerInfraestructure } from "./module/infraestructure/broker.infraestructure";
import { PaymentInfraestructure } from "./module/infraestructure/payment.infraestructure";
import BrokerController from "./module/interface/broker/broker.controller";

import dotenv from "dotenv";

dotenv.config();

const server = new ServerBootstrap();
const database = new DatabaseBootstrap();
const broker = new BrookerBootstrap();

const infraestructure: PaymentRepository = new PaymentInfraestructure();
const brokerInfraestructure: BrokerRepository = new BrokerInfraestructure();
const application = new PaymentApplication(infraestructure, brokerInfraestructure);
const brokerController = new BrokerController(application);

(async () => {
  try {
    const listPromises = [server.initialize(), database.initialize(), broker.initialize()];
    await Promise.all(listPromises);
    await brokerController.listen();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
