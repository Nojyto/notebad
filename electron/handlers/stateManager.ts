import { app } from 'electron';
import fs from 'fs/promises';
import path from 'node:path';

const STATE_FILE_PATH = path.join(app.getPath('userData'), 'editor-state.json');

export async function loadAppState() {
  try {
    const state = await fs.readFile(STATE_FILE_PATH, 'utf-8');
    return JSON.parse(state);
  } catch {
    return { tabs: [], activeIndex: 0 };
  }
}

export async function saveAppState(state: JSON) {
  try {
    await fs.writeFile(STATE_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}