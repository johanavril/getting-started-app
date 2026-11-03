const { createApp } = require('./app');

const loadPort = () => {
    const portNumber = process.env.PORT ?? '3000';
    if (
        typeof portNumber != 'string' ||
        portNumber.trim() == '' ||
        isNaN(portNumber)
    ) {
        throw new Error(
            `invalid port number, must be a number, got ${portNumber}`
        );
    }
    const port = Number(portNumber);
    if (port != Math.floor(port) || port < 1 || port > 65535) {
        throw new Error(
            'invalid port number, must be a number between 1 and 65535'
        );
    }
    return port;
};

(async () => {
    const port = loadPort();

    const { app, db } = await createApp();

    const server = app.listen(port);
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${port} is already in use.`);
            process.exit(1);
        } else {
            console.error('Server error:', err);
        }
    });
    server.once('listening', () => {
        console.log(`Listening on port ${port}`);
    });

    const gracefulShutdown = () => {
        console.log('start shutdown', new Date());
        server.close(() => {
            console.log('server closed', new Date());
            db.teardown().then(() => {
                console.log('db toredown', new Date());
                process.exit();
            });
        });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
})();
