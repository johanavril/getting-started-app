const supertest = require('supertest');
const { createApp } = require('../../src/app');

let app, db;
beforeAll(async () => {
    ({ app, db } = await createApp());
});

afterAll(async () => {
    await db.teardown();
});

test('it can serve response', async () => {
    const response = await supertest(app).get('/healthz').expect(200);
    expect(response.body).toEqual({ status: 'ok' });
});
