#!/usr/bin/env node
import { render } from 'ink';
import CLI from './cli';
import Setup from './setup';
import { join, dirname } from 'path';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    // Resolve config.json path relative to the runtime location
    const configPath = join(__dirname, 'config.json');

    let developmentDir;

    // Check if config file exists
    if (existsSync(configPath)) {
        try {
            const config = JSON.parse(readFileSync(configPath, 'utf8'));
            developmentDir = config.developmentDir;
        } catch (error) {
            console.error('Error reading config file:', error);
        }
    }

    // If no valid directory found, render setup
    if (!developmentDir || !existsSync(developmentDir)) {
        render(<Setup configPath={configPath} />);
        return;
    }

    // Render main app with development directory
    render(<CLI configPath={configPath} developmentDir={developmentDir} />);
}

main().catch(console.error);

