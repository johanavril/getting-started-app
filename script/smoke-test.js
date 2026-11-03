class RetryableError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RetryableError';
    }
}

const isStatusCodeRetryable = (statusCode) => {
    return [408, 429, 500, 502, 503, 504].includes(statusCode);
};

const sendRequest = async (url) => {
    const response = await fetch(url, {
        signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
        const body = await response.text();
        const message = `HTTP Error. Status ${response.status}. Body ${body}`;
        if (isStatusCodeRetryable(response.status))
            throw new RetryableError(message);
        throw new Error(`HTTP Error. Status ${response.status}. Body ${body}`);
    }
    const resp = await response.json();
    console.log(`Success. ${JSON.stringify(resp)}`);
    return resp;
};

const sleep = async (ms) => {
    return new Promise((r) => setTimeout(r, ms));
};

const exponentialBackoff = async (baseDelay, maxDelay, attempt) => {
    const calculatedDelay = baseDelay * Math.pow(2, attempt);
    const effectiveDelay = Math.min(calculatedDelay, maxDelay);
    const jitteredDelay = Math.random() * effectiveDelay;
    await sleep(jitteredDelay);
};

(async () => {
    const url = process.argv[2];

    let attempt = 0;
    while (attempt < 5) {
        try {
            await sendRequest(url);
            console.log('smoke test OK');
            process.exit(0);
        } catch (err) {
            console.log(err.message, err.name, err.cause);

            if (
                err instanceof RetryableError ||
                err.name === 'TimeoutError' ||
                err.cause?.code === 'ECONNREFUSED'
            ) {
                if (attempt < 4) await exponentialBackoff(500, 30000, attempt);
                attempt += 1;
                continue;
            }
            process.exit(1);
        }
    }
    process.exit(1);
})();
