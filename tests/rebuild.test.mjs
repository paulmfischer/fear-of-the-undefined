import { test } from "node:test";
import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, writeFile, rm, symlink, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join, basename } from "node:path";
import { execFileSync, spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";

test("clean and watched rebuilds remove renamed pages, deleted content/assets and stale publishing output", { timeout: 45000 }, async () => {
  const fixture = await mkdtemp(join(tmpdir(), "eleventy-rebuild-"));
  try {
    const excluded = new Set([".git", "node_modules", "_site", "_site-eleventy", "_cache", "_vendor", "docs"]);
    await cp(process.cwd(), fixture, { recursive: true, filter: path => !excluded.has(basename(path)) });
    await symlink(resolve("node_modules"), join(fixture, "node_modules"), "dir");
    const directory = join(fixture, "posts/rebuild-probe");
    await mkdir(directory, { recursive: true });
    const source = join(directory, "index.md");
    const content = '---\ntitle: Rebuild probe\ndate: 2000-01-01T05:00:00Z\nurl: ./index.html\n---\nquartzmarigoldcobalt\n';
    await writeFile(source, content);
    await writeFile(join(directory, "probe.svg"), '<svg xmlns="http://www.w3.org/2000/svg"/>');
    const build = () => execFileSync(process.execPath, [resolve("node_modules/@11ty/eleventy/cmd.cjs"), "--config=eleventy.config.js"], { cwd: fixture, stdio: "pipe" });
    const generated = path => join(fixture, "_site", path);
    build();
    await access(generated("posts/rebuild-probe/index.html"));
    await access(generated("posts/rebuild-probe/probe.svg"));
    assert.equal(JSON.parse(await readFile(generated("posts.json"))).items.length, 10);

    await writeFile(source, content.replace("./index.html", "./renamed.html"));
    await rm(join(directory, "probe.svg"));
    build();
    await assert.rejects(access(generated("posts/rebuild-probe/index.html")));
    await assert.rejects(access(generated("posts/rebuild-probe/probe.svg")));
    await access(generated("posts/rebuild-probe/renamed.html"));
    await access(generated("assets/img/avatar-150x150.png"));

    await rm(directory, { recursive: true });
    await writeFile(generated("orphan.txt"), "must not survive");
    build();
    await assert.rejects(access(generated("posts/rebuild-probe/renamed.html")));
    await assert.rejects(access(generated("orphan.txt")));
    assert.equal(JSON.parse(await readFile(generated("posts.json"))).items.length, 9);
    for (const path of ["index.html", "sitemap.xml", "posts.rss", "posts.json"]) {
      assert(!(await readFile(generated(path), "utf8")).includes("rebuild-probe"), path);
    }

    const portProbe = createServer();
    await new Promise(resolve => portProbe.listen(0, "127.0.0.1", resolve));
    const port = portProbe.address().port;
    await new Promise(resolve => portProbe.close(resolve));
    const preview = spawn(process.execPath, ["--import", "tsx", "scripts/serve-eleventy.ts"], {
      cwd: fixture, env: { ...process.env, PREVIEW_PORT: String(port) }, stdio: ["ignore", "pipe", "pipe"],
    });
    let logs = "";
    for (const stream of [preview.stdout, preview.stderr]) stream.on("data", chunk => { logs = (logs + chunk).slice(-5000); });
    const waitForBuild = async (count, route) => {
      for (let attempt = 0; attempt < 150; attempt++) {
        try {
          const data = await (await fetch(`http://127.0.0.1:${port}/posts.json`)).json();
          assert.equal(data.items.length, count);
          await access(generated("pagefind/pagefind.js"));
          await access(generated("assets/img/avatar-150x150.png"));
          if (route) await access(generated(route));
          return;
        } catch { await new Promise(resolve => setTimeout(resolve, 100)); }
      }
      assert.fail(`Watched build did not settle: ${logs}`);
    };
    try {
      await waitForBuild(9);
      await mkdir(directory, { recursive: true });
      await writeFile(source, content);
      await writeFile(join(directory, "probe.svg"), '<svg xmlns="http://www.w3.org/2000/svg"/>');
      await waitForBuild(10, "posts/rebuild-probe/index.html");
      await writeFile(source, content.replace("./index.html", "./renamed.html"));
      await waitForBuild(10, "posts/rebuild-probe/renamed.html");
      await assert.rejects(access(generated("posts/rebuild-probe/index.html")));
      await rm(directory, { recursive: true });
      await waitForBuild(9);
      await assert.rejects(access(generated("posts/rebuild-probe/renamed.html")));
      await assert.rejects(access(generated("posts/rebuild-probe/probe.svg")));
    } finally {
      if (preview.exitCode === null && preview.signalCode === null) {
        const exited = once(preview, "exit");
        preview.kill("SIGTERM");
        await exited;
      }
    }
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
