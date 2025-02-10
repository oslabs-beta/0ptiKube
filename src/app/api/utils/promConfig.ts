import os from 'os';
import path from 'path';
import fs from 'fs';

/** Reads MiniKube configuration from the local file system */
export function getMiniKubeConfig(): Record<string, string> {
  try {
    const homeDirectory = os.homedir();
    const configPath = path.resolve(
      homeDirectory,
      '.minikube/config/config.json'
    );
    const fileContents = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error readying MiniKube config:', error);
    return {};
  }
}
