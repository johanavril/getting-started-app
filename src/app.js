const express = require('express');
const db = require('./persistence');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');
const health = require('./routes/health');

const createApp = async () => {
    const app = express();

    app.use(express.json());
    app.use(express.static(__dirname + '/static'));

    app.get('/items', getItems);
    app.post('/items', addItem);
    app.put('/items/:id', updateItem);
    app.delete('/items/:id', deleteItem);
    app.get('/healthz', health);

    try {
        await db.init();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    return { app, db };
};

module.exports = {
    createApp,
};
