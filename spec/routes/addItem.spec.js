const db = require('../../src/persistence');
const addItem = require('../../src/routes/addItem');
const { v4: uuid } = require('uuid');

jest.mock('uuid', () => ({ v4: jest.fn() }));

jest.mock('../../src/persistence', () => ({
    removeItem: jest.fn(),
    storeItem: jest.fn(),
    getItem: jest.fn(),
}));

beforeEach(() => {
    jest.resetAllMocks();
});

test('it stores item correctly', async () => {
    const id = 'something-not-a-uuid';
    const name = 'A sample item';
    const req = { body: { name } };
    const res = { send: jest.fn() };

    uuid.mockReturnValue(id);

    await addItem(req, res);

    const expectedItem = { id, name, completed: false };

    expect(db.storeItem.mock.calls.length).toBe(1);
    expect(db.storeItem.mock.calls[0][0]).toEqual(expectedItem);
    expect(res.send.mock.calls[0].length).toBe(1);
    expect(res.send.mock.calls[0][0]).toEqual(expectedItem);
});

test.each([undefined, '    ', 42])(
    'it reject store item when name is %s',
    async (name) => {
        const req = { body: { name } };
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };

        await addItem(req, res);

        expect(db.storeItem.mock.calls.length).toBe(0);
        expect(res.status.mock.calls[0].length).toBe(1);
        expect(res.status.mock.calls[0][0]).toEqual(400);
        expect(res.send.mock.calls[0].length).toBe(1);
        expect(res.send.mock.calls[0][0]).toEqual({
            status: 'error',
            message: 'invalid name',
        });
    }
);
