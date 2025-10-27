import ServerBootstrap from "./bootstrap/server.bootstrap";
import DatabaseBootstrap from "./bootstrap/database.bootstrap";
import BrookerBootstrap from "./bootstrap/broker.bootstrap";
import BrokerController from "./module/interface/broker/broker.controller";
import { OrderApplication } from "./module/application/order.application";
import { OrderInfraestructure } from "./module/infraestructure/order.infraestructure";
import { BrokerRepository } from "./module/domain/repositories/broker.repository";
import { BrokerInfraestructure } from "./module/infraestructure/broker.infraestructure";
import { OrderRepository } from "./module/domain/repositories/order.repository";
import dotenv from "dotenv";

dotenv.config();

const server = new ServerBootstrap();
const database = new DatabaseBootstrap();
const broker = new BrookerBootstrap();

const orderInfraestructure: OrderRepository = new OrderInfraestructure();
const brokerInfraestructure: BrokerRepository = new BrokerInfraestructure();
const orderApplication = new OrderApplication(orderInfraestructure, brokerInfraestructure);
const brokerController = new BrokerController(orderApplication);

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
