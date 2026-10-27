const fs = require('fs');
const supertest = require('supertest');
const { createApp } = require('../../src/app');

let app;
beforeAll(async () => {
  app = await createApp();
});

test('it can serve response', async () => {
  const response = await supertest(app).get('/healthz').expect(200);
  expect(response.body).toEqual({status: 'ok'});
});
