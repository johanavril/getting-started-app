const express = require('express');
const app = express();
const db = require('./persistence');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');

app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

db.init().then(() => {
    const portNumber = process.env.PORT ?? '3000';
    if (isNaN(portNumber)) {
      throw new Error(' invalid port number, must be a number');
    }
    const port = Number.parseInt(portNumber, 10);
    if(Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('invalid port number, must be a number between 1 and 65535');
    }
    app.listen(port, () => console.log(`Listening on port ${port}`));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
