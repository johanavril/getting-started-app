const db = require('../persistence');

module.exports = async (req, res) => {
    console.log('healthcheck');
    await db.health();
    res.send({ status: 'ok' });
};
