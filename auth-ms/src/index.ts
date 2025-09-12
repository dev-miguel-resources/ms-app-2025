import ServerBootstrap from "./bootstrap/server.bootstrap";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  try {
    const serverBootstrap = new ServerBootstrap();

    await serverBootstrap.initialize();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
})();
