// Official Volcano Ark CLI data source (SSO only).
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
let cachedCommand;

function packageCommand() {
  try {
    const packageJson = require.resolve("@volcengine/ark-cli/package.json");
    const script = join(dirname(packageJson), "scripts", "run.js");
    return existsSync(script) ? { command: process.execPath, prefix: [script] } : null;
  } catch {
    return null;
  }
}

export function locateArkcli() {
  if (cachedCommand !== undefined) return cachedCommand;
  if (process.env.ARKCLI_BIN) {
    cachedCommand = { command: process.env.ARKCLI_BIN, prefix: [] };
    return cachedCommand;
  }
  cachedCommand = packageCommand();
  return cachedCommand;
}

export function runArkcli(resolved, args, options = {}) {
  const timeoutMs = options.timeoutMs ?? 25_000;
  return new Promise((resolve, reject) => {
    const child = spawn(resolved.command, [...resolved.prefix, ...args], {
      env: { ...process.env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      finish(reject, new Error(`arkcli timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", (error) => finish(reject, error));
    child.on("close", (code) => {
      if (code === 0) finish(resolve, stdout);
      else finish(reject, new Error(`arkcli exited ${code}: ${stderr.slice(0, 500)}`));
    });
  });
}

export async function isLoggedIn(resolved) {
  try {
    const output = await runArkcli(resolved, ["auth", "status"], { timeoutMs: 15_000 });
    return /"logged_in"\s*:\s*true/.test(output);
  } catch {
    return false;
  }
}

export async function queryPlanBalance(resolved) {
  const output = await runArkcli(resolved, [
    "usage", "balance", "--type", "plan", "--format", "json",
  ]);
  return JSON.parse(output);
}

export async function fetchArkcliSnapshot() {
  const resolved = locateArkcli();
  if (!resolved || !(await isLoggedIn(resolved))) return null;
  const plan = await queryPlanBalance(resolved).catch((error) => ({ error: String(error) }));
  return { source: "arkcli", plan };
}
