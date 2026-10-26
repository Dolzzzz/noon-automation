import fs from 'fs';
import path from 'path';

// Hands small facts from one flow to the next (e.g. which product went into the wishlist),
// since each flow lives in its own spec file.
const STATE_FILE = path.join(__dirname, '..', '.auth', 'shared-state.json');

type SharedState = {
  wishlistProduct?: { sku: string; name: string; url: string };
};

function read(): SharedState {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

export function getShared<K extends keyof SharedState>(key: K): SharedState[K] {
  return read()[key];
}

export function setShared<K extends keyof SharedState>(key: K, value: SharedState[K]) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify({ ...read(), [key]: value }, null, 2));
}
