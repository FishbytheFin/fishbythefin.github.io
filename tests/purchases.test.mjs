import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

// Exercise the actual app's purchase and listener logic with controlled Firestore
// responses. No network requests or production database writes.
const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '')
  .replace(/function render\(\) \{[\s\S]*?\nasync function purchase/, 'function render() {}\nasync function purchase');
const gift = { id: 'test-gift', name: 'Test gift' };
async function client({ transaction, read = async () => ({ exists: () => true }) }) {
  const status = {};
  let listener;
  const context = vm.createContext({
    console, URL, Set,
    document: { querySelector: selector => selector === '#status' ? status : { addEventListener() {} } },
    window: { confirm: () => true },
    initializeApp: () => ({}), getFirestore: () => ({}),
    collection: () => ({}), doc: (_db, _collection, id) => id,
    serverTimestamp: () => 'timestamp',
    runTransaction: transaction, getDocFromServer: read,
    onSnapshot: (_ref, _options, callback) => { listener = callback; },
    fetch: async () => ({ ok: true, json: async () => [gift] }),
  });
  await vm.runInContext(`(async () => { ${source}\n globalThis.api = { purchase, state: () => ({ purchased: [...purchased], ready, pending: [...pending] }) }; })()`, context);
  const snapshot = (ids, metadata = {}) => listener({
    docs: ids.map(id => ({ id })),
    metadata: { fromCache: false, hasPendingWrites: false, ...metadata },
  });
  snapshot([]);
  return { ...context.api, status, snapshot };
}

test('simultaneous winner and rejected loser both end purchased', async () => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const winner = await client({ transaction: async () => { await gate; return true; } });
  const loser = await client({ transaction: async () => { await gate; throw { code: 'permission-denied' }; } });
  const attempts = [winner.purchase(gift), loser.purchase(gift)];
  release();
  await Promise.all(attempts);
  for (const browser of [winner, loser]) {
    assert.equal(browser.state().purchased.includes(gift.id), true);
    assert.equal(browser.state().pending.length, 0);
  }
  assert.match(loser.status.textContent, /already marked/);
});

test('pending and cached snapshots preserve confirmed purchases; server reset clears them', async () => {
  const browser = await client({ transaction: async () => true });
  browser.snapshot([gift.id]);
  browser.snapshot([], { hasPendingWrites: true });
  assert.equal(browser.state().purchased.includes(gift.id), true);
  browser.snapshot([], { fromCache: true });
  assert.equal(browser.state().purchased.includes(gift.id), true);
  assert.equal(browser.state().ready, false);
  browser.snapshot([]);
  assert.equal(browser.state().purchased.length, 0);
  assert.equal(browser.state().ready, true);
});

test('genuine permission failure remains available with a rules error', async () => {
  const browser = await client({ transaction: async () => { throw { code: 'permission-denied' }; }, read: async () => ({ exists: () => false }) });
  await browser.purchase(gift);
  assert.equal(browser.state().purchased.length, 0);
  assert.match(browser.status.textContent, /rules/);
});

test('failed verification disables purchases instead of assuming availability', async () => {
  const browser = await client({ transaction: async () => { throw Error('offline'); }, read: async () => { throw Error('offline'); } });
  await browser.purchase(gift);
  assert.equal(browser.state().ready, false);
  assert.equal(browser.state().pending.length, 0);
});
