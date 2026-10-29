const db = require('../persistence');

module.exports = async (req, res) => {
    await db.health();
    res.send({ status: 'ok' });
};
