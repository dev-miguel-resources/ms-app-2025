import ServerBootstrap from "./bootstrap/server.bootstrap";
import DatabaseBootstrap from "./bootstrap/database.bootstrap";
import BrookerBootstrap from "./bootstrap/broker.bootstrap";
import dotenv from "dotenv";

dotenv.config();

const server = new ServerBootstrap();
const database = new DatabaseBootstrap();
const broker = new BrookerBootstrap();

(async () => {
  try {
    const listPromises = [server.initialize(), database.initialize(), broker.initialize()];
    await Promise.all(listPromises);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
