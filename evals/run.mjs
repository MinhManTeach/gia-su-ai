#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { formatReport, runEvaluations } from './evaluate.mjs';

const args = process.argv.slice(2);
const jsonOutput = args.includes('--format') && args[args.indexOf('--format') + 1] === 'json';
const adapterIndex = args.indexOf('--adapter');
const adapterPath = adapterIndex === -1 ? null : args[adapterIndex + 1];
if (adapterIndex !== -1 && !adapterPath) {
  console.error('Usage: node evals/run.mjs [--format json] [--adapter <module.mjs>]');
  process.exit(2);
}

const scenarios = JSON.parse(await readFile(new URL('./scenarios.json', import.meta.url), 'utf8'));
let respond;
if (adapterPath) {
  const adapter = await import(pathToFileURL(resolve(adapterPath)).href);
  if (typeof adapter.respond !== 'function') {
    console.error('Adapter must export async function respond(scenario) returning a response string.');
    process.exit(2);
  }
  respond = adapter.respond;
}

const report = await runEvaluations(scenarios, respond);
console.log(jsonOutput ? JSON.stringify(report, null, 2) : formatReport(report));
if (report.failed) process.exitCode = 1;
