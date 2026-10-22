import { watch } from "node:fs";
import { spawn, type ChildProcess } from "node:child_process";

// Eleventy's Markdown watcher can rebuild in-process. Imported TSX modules need
// a fresh process: clearing only the template cache leaves ESM imports stale.
let child: ChildProcess | undefined;
let restartRequested = false;
let stopping = false;
let debounce: NodeJS.Timeout | undefined;

function start() {
  child = spawn(process.execPath, [
    "node_modules/@11ty/eleventy/cmd.cjs",
    "--config=eleventy.config.js",
    "--serve",
    "--port=8080",
  ], { stdio: "inherit" });

  child.on("error", (error) => {
    console.error(error);
    shutdown(1);
  });
  child.on("exit", (code) => {
    child = undefined;
    if (stopping) {
      process.exitCode ??= code ?? 0;
    } else if (restartRequested) {
      restartRequested = false;
      start();
    } else {
      // Keep the watcher alive so a config/template fix can restart a failed build.
      console.error(`[serve] Eleventy exited (${code}); waiting for a source edit.`);
    }
  });
}

function scheduleRestart() {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    if (stopping) return;
    console.log("[serve] Reloading TSX/configuration in a fresh process.");
    if (child) {
      restartRequested = true;
      child.kill("SIGTERM");
    } else {
      start();
    }
  }, 150);
}

const watchers = [
  watch("_eleventy", { recursive: true }, scheduleRestart),
  watch("_includes/styles", { recursive: true }, scheduleRestart),
  // Watch the directory so atomic-save editors can replace config file inodes.
  watch(".", (_event, filename) => {
    if (["consts.ts", "eleventy.config.js", "tsconfig.json", "index.11ty.tsx", "_data.yml", "styles.css"].includes(String(filename))) {
      scheduleRestart();
    }
  }),
  watch("posts", { recursive: true }, (_event, filename) => {
    if (String(filename).endsWith(".11tydata.js") || String(filename).endsWith("_data.yml")) scheduleRestart();
  }),
];

function shutdown(code: number) {
  stopping = true;
  process.exitCode = code;
  clearTimeout(debounce);
  for (const watcher of watchers) watcher.close();
  child?.kill("SIGTERM");
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => shutdown(0));
}
start();
