import ServerBootstrap from "./bootstrap/server.bootstrap";
import DatabaseBootstrap from "./bootstrap/database.bootstrap";
import dotenv from "dotenv";

dotenv.config();

const server = new ServerBootstrap();
const database = new DatabaseBootstrap();

(async () => {
  try {
    const listPromises = [server.initialize(), database.initialize()];
    await Promise.all(listPromises);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

// Levantando solo el server
/*(async () => {
  try {
    const serverBootstrap = new ServerBootstrap();

    await serverBootstrap.initialize();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
})();*/
