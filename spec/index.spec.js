const { spawnSync, spawn } = require('child_process');
const { mkdtempSync, existsSync, rmSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');

describe('application initialization', () => {
    test.each(['abc', '3100abc', '1.5', '0', '65536', '', '    '])(
        'reject %s before creating DB and starting the server',
        (port) => {
            const directory = mkdtempSync(join(tmpdir(), 'todos-'));
            const database = join(directory, 'todos.db');

            try {
                const result = spawnSync(process.execPath, ['src/index.js'], {
                    // Assumes the test command runs from the repository root.
                    cwd: process.cwd(),
                    env: {
                        ...process.env,
                        PORT: port,
                        MYSQL_HOST: '',
                        SQLITE_DB_LOCATION: database,
                    },
                    encoding: 'utf8',
                    timeout: 2000,
                    killSignal: 'SIGKILL',
                });

                expect(result.error).toBeUndefined();
                expect(result.status).toBe(1);
                expect(result.stderr).toContain('invalid port number');
                expect(existsSync(database)).toBe(false);
            } finally {
                rmSync(directory, { recursive: true, force: true });
            }
        }
    );

    test.each([
        { port: undefined, expected: '3000' },
        { port: '3100', expected: '3100' },
    ])(
        'successfully serve $served when port specified is $port',
        async ({ port, expected }) => {
            const directory = mkdtempSync(join(tmpdir(), 'todos-'));
            const database = join(directory, 'todos.db');

            try {
                const env = {
                    ...process.env,
                    PORT: port,
                    MYSQL_HOST: '',
                    SQLITE_DB_LOCATION: database,
                };
                if (port === undefined) {
                    delete env.PORT;
                }

                const child = spawn(process.execPath, ['src/index.js'], {
                    cwd: join(__dirname, '..'),
                    env,
                    timeout: 3000,
                    killSignal: 'SIGKILL',
                });

                const closed = new Promise((resolve) =>
                    child.once('close', resolve)
                );
                let stdout = '';
                let stderr = '';

                child.stderr.on('data', (chunk) => {
                    stderr += chunk;
                });

                try {
                    await new Promise((resolve, reject) => {
                        child.once('error', reject);
                        child.once('close', (code, signal) => {
                            reject(
                                new Error(
                                    `Server exited: ${code ?? signal}\n${stderr}`
                                )
                            );
                        });

                        child.stdout.on('data', (chunk) => {
                            stdout += chunk;
                            if (
                                stdout.includes(
                                    `Listening on port ${expected}\n`
                                )
                            ) {
                                resolve();
                            }
                        });
                    });

                    const response = await fetch(
                        `http://127.0.0.1:${expected}/items`
                    );
                    expect(response.status).toBe(200);
                    expect(await response.json()).toEqual([]);
                    expect(existsSync(database)).toBe(true);
                } finally {
                    child.kill('SIGTERM');
                    await closed;
                    rmSync(directory, { recursive: true, force: true });
                }
            } finally {
                rmSync(directory, { recursive: true, force: true });
            }
        }
    );
});
