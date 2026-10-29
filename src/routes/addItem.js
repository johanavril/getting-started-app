const db = require('../persistence');
const { v4: uuid } = require('uuid');

module.exports = async (req, res) => {
    if (typeof req.body.name !== 'string' || req.body.name.trim() === '') {
        return res
            .status(400)
            .send({ status: 'error', message: 'invalid name' });
    }
    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
    };

    await db.storeItem(item);
    res.send(item);
};
