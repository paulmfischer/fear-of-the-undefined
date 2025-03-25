import Server from 'lume/core/server.ts';
import logger from "lume/middlewares/logger.ts";

const server = new Server({
  port: 8000,
  root: `${Deno.cwd()}/_site`,
});

server.use(logger());
server.start();

console.log("Listening on http://localhost:8000");