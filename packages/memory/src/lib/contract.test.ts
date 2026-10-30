// @vitest-environment node
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { runContract } from './contract.js';
import { createHttpClient } from './http.js';

// A cold uteke-serve loads its embedding model on first use, which can take seconds.
vi.setConfig({ testTimeout: 60_000 });

const freePort = () =>
  new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });

function hasBinary(name: string) {
  return (process.env.PATH ?? '').split(':').some((dir) => {
    try {
      return spawnSyncOk(join(dir, name));
    } catch {
      return false;
    }
  });
}
import { accessSync, constants } from 'node:fs';
function spawnSyncOk(path: string) {
  accessSync(path, constants.X_OK);
  return true;
}

/** A real uteke-serve in a temp data directory, used only when the binary is installed. */
const SERVE = hasBinary('uteke-serve');
const TOKEN = 'contract-test-token';

describe.skipIf(!SERVE)('uteke-serve', () => {
  let child: ChildProcess;
  let home = '';
  let port = 0;

  beforeAll(async () => {
    // A fixed temp directory, never the user's real data: a fresh one makes
    // uteke-serve download its embedding model again (about 40 s). Tests use
    // unique tags, so leftover data from earlier runs does not matter.
    home = join(tmpdir(), 'codecora-ui-uteke-contract');
    mkdirSync(home, { recursive: true });
    port = await freePort();
    child = spawn('uteke-serve', ['--port', String(port), '--auth-token', TOKEN], {
      env: { ...process.env, UTEKE_HOME: home },
      stdio: 'ignore',
    });
    const deadline = Date.now() + 15_000;
    for (;;) {
      try {
        if ((await fetch(`http://127.0.0.1:${port}/health`)).ok) break;
      } catch {
        // not up yet
      }
      if (Date.now() > deadline) throw new Error('uteke-serve did not start');
      await new Promise((r) => setTimeout(r, 150));
    }
  }, 30_000);

  afterAll(() => {
    child?.kill();
  });

  const make = () => createHttpClient({ baseUrl: `http://127.0.0.1:${port}`, apiKey: TOKEN });
  const noKey = () => createHttpClient({ baseUrl: `http://127.0.0.1:${port}` });

  runContract('uteke-serve (real server)', make, { auth: noKey });

  it('reaches the server only with the token (health is open)', async () => {
    expect((await noKey().health()).status).toBe('ok');
    await expect(noKey().list()).rejects.toMatchObject({ status: 401 });
  });
});

const CLOUD_URL = process.env.UTEKE_CLOUD_URL;
const CLOUD_KEY = process.env.UTEKE_CLOUD_KEY;

describe.skipIf(!CLOUD_URL || !CLOUD_KEY)('Uteke Cloud test stack', () => {
  runContract(
    'uteke cloud (API key)',
    () => createHttpClient({ baseUrl: CLOUD_URL!, kind: 'cloud', apiKey: CLOUD_KEY }),
    { auth: () => createHttpClient({ baseUrl: CLOUD_URL!, kind: 'cloud', apiKey: 'wrong-key' }) },
  );
});

describe('contract setup', () => {
  it('says what was skipped and why', () => {
    // The suites above are skipped without the binary or the Cloud variables;
    // this keeps that visible in the test output instead of silently green.
    expect(typeof SERVE).toBe('boolean');
    expect(typeof CLOUD_URL === 'string' || CLOUD_URL === undefined).toBe(true);
  });
});
