import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js';
import { getFirestore, collection, doc, getDocFromServer, onSnapshot, runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js';

const db = getFirestore(initializeApp({
  apiKey: 'AIzaSyDjZAuCZwnybM2IFOFl3Iy2U2WCH3ZCQW4',
  authDomain: 'finn-gift.firebaseapp.com',
  projectId: 'finn-gift',
  storageBucket: 'finn-gift.firebasestorage.app',
  messagingSenderId: '796399042377',
  appId: '1:796399042377:web:f475e76ac85f6df59ee498',
}));
const grid = document.querySelector('#gifts');
const status = document.querySelector('#status');
const filter = document.querySelector('#available-only');
let gifts = [];
let purchased = new Set();
let ready = false;
const pending = new Set();

function element(tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}
function render() {
  grid.replaceChildren();
  const remaining = gifts.filter(gift => !purchased.has(gift.id)).length;
  document.querySelector('#summary').textContent = ready
    ? `${remaining} available · ${gifts.length} gifts`
    : `${gifts.length} gifts · checking purchase status`;
  for (const gift of gifts) {
    const bought = purchased.has(gift.id);
    if (filter.checked && bought) continue;
    const card = element('article', '', `gift${bought ? ' purchased' : ''}`);
    const media = element('div', '', 'gift-image');
    const placeholder = element('span', 'No image yet');
    media.append(placeholder);
    if (typeof gift.image === 'string' && gift.image.trim()) {
      try {
        const imageUrl = new URL(gift.image, document.baseURI);
        if (['https:', 'http:'].includes(imageUrl.protocol)) {
          const image = document.createElement('img');
          image.alt = gift.imageAlt || gift.name;
          image.loading = 'lazy';
          image.decoding = 'async';
          image.addEventListener('load', () => { placeholder.hidden = true; });
          image.addEventListener('error', () => {
            image.remove();
            placeholder.hidden = false;
            placeholder.textContent = 'Image unavailable';
          });
          image.src = imageUrl.href;
          media.append(image);
        }
      } catch {
        placeholder.textContent = 'Image unavailable';
      }
    }
    card.append(media);
    card.append(element('span', bought ? '✓ Purchased' : ready ? 'Available' : 'Checking…', 'badge'), element('h2', gift.name), element('p', gift.description ?? '', 'description'));
    if (gift.price !== undefined && gift.price !== null && String(gift.price).trim()) {
      const price = String(gift.price).trim().replace(/^\$+\s*/, '');
      card.append(element('p', `$${price}`, 'price'));
    }
    if (gift.url) {
      const url = new URL(gift.url);
      if (['https:', 'http:'].includes(url.protocol)) {
        const link = element('a', 'View gift ↗');
        link.href = url.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        card.append(link);
      }
    }
    const button = element('button', pending.has(gift.id) ? 'Saving…' : bought ? 'Already purchased' : 'Mark as purchased');
    button.type = 'button';
    button.disabled = !ready || bought || pending.has(gift.id);
    button.addEventListener('click', () => purchase(gift));
    card.append(button);
    grid.append(card);
  }
  const empty = document.querySelector('#empty');
  empty.hidden = grid.children.length > 0;
  empty.textContent = gifts.length ? 'All gifts are covered. Thank you!' : 'The gift list is coming soon.';
}
async function purchase(gift) {
  if (!ready || purchased.has(gift.id) || pending.has(gift.id) || !window.confirm(`Mark “${gift.name}” as purchased? Please confirm only once you have bought it. Contact the registry owner if you need to undo this.`)) return;
  pending.add(gift.id);
  render();
  try {
    const result = await runTransaction(db, async transaction => {
      const ref = doc(db, 'purchases', gift.id);
      const existing = await transaction.get(ref);
      if (existing.exists()) return false;
      transaction.set(ref, { purchasedAt: serverTimestamp() });
      return true;
    });
    purchased.add(gift.id);
    status.textContent = result ? `Thank you! “${gift.name}” is marked as purchased.` : `Someone has already marked “${gift.name}” as purchased.`;
  } catch (error) {
    // A competing create can be rejected by the create-only security rules.
    // Read the server before interpreting that rejection as a failed purchase.
    try {
      const existing = await getDocFromServer(doc(db, 'purchases', gift.id));
      if (existing.exists()) {
        purchased.add(gift.id);
        status.textContent = `Someone has already marked “${gift.name}” as purchased.`;
      } else {
        purchased.delete(gift.id);
        status.textContent = error.code === 'permission-denied'
          ? 'The purchase could not be saved. The registry owner needs to check the Firestore rules.'
          : 'The purchase was not saved. Please try again.';
      }
    } catch {
      ready = false;
      status.textContent = 'Purchase status could not be verified. Check your connection and refresh before trying again.';
    }
  } finally {
    pending.delete(gift.id);
    render();
  }
}
filter.addEventListener('change', render);
try {
  const response = await fetch('./gifts.json');
  if (!response.ok) throw new Error('Gift list unavailable');
  gifts = await response.json();
  if (!Array.isArray(gifts) || gifts.some(gift => !gift || typeof gift.id !== 'string' || !/^[a-z0-9-]+$/.test(gift.id) || typeof gift.name !== 'string' || (gift.description != null && typeof gift.description !== 'string')) || new Set(gifts.map(gift => gift.id)).size !== gifts.length) throw new Error('Invalid gift list');
  for (const gift of gifts) if (gift.url) new URL(gift.url);
  render();
  onSnapshot(collection(db, 'purchases'), { includeMetadataChanges: true }, snapshot => {
    // Optimistic writes and their rollbacks must not erase confirmed purchases.
    // Only a complete, settled server snapshot can replace the shared state.
    if (!snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {
      purchased = new Set(snapshot.docs.map(item => item.id));
    }
    ready = !snapshot.metadata.fromCache;
    status.textContent = ready ? 'Purchase status is up to date.' : 'Connecting… purchase status may be out of date.';
    render();
  }, () => {
    ready = false;
    status.textContent = 'Purchase status is unavailable. Check your connection, or ask the registry owner to publish the Firestore rules, then refresh.';
    render();
  });
} catch (error) {
  console.error('Unable to load gift list:', error);
  status.textContent = 'The gift list could not be loaded. Please refresh or ask the registry owner to check gifts.json.';
}
