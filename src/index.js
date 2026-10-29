const { createApp } = require("./app");

const loadPort = () => {
  const portNumber = process.env.PORT ?? '3000';
  if (typeof portNumber != 'string' || portNumber.trim() == '' || isNaN(portNumber)) {
    throw new Error(`invalid port number, must be a number, got ${portNumber}`);
  }
  const port = Number(portNumber);
  if(port != Math.floor(port) || port < 1 || port > 65535) {
    throw new Error('invalid port number, must be a number between 1 and 65535');
  }
  return port
}

(async () => {
  const port = loadPort();

  const { app, db } = await createApp();

  const server = app.listen(port, () => console.log(`Listening on port ${port}`));

  const gracefulShutdown = () => {
      db.teardown()
          .catch(() => {})
          .then(() => server.close(() => {
            process.exit();
          }));
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
})();
