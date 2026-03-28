import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const rootDir = process.cwd();
const releaseRoot = join(rootDir, ".release");
const bundleName = "aip-foundry-themis-starter-demo";
const stagingDir = join(releaseRoot, bundleName);
const zipPath = join(releaseRoot, `${bundleName}.zip`);

async function run(cmd, args, cwd = rootDir) {
  const { stdout, stderr } = await execFileAsync(cmd, args, {
    cwd,
    env: process.env,
  });
  if (stdout.trim()) {
    process.stdout.write(stdout);
  }
  if (stderr.trim()) {
    process.stderr.write(stderr);
  }
}

async function copyIntoBundle(relativePath) {
  const source = join(rootDir, relativePath);
  const destination = join(stagingDir, relativePath);
  await mkdir(resolve(destination, ".."), { recursive: true });
  await cp(source, destination, { recursive: true });
}

async function main() {
  await rm(releaseRoot, { recursive: true, force: true });
  await mkdir(stagingDir, { recursive: true });

  await run("npm", ["run", "typecheck"]);
  await run("npm", ["run", "generate"]);
  await run("npm", ["test"]);
  await run("npm", ["--prefix", "examples/osdk-react-app", "run", "build"]);

  const includePaths = [
    "README.md",
    "AGENTS.md",
    "package.json",
    "tsconfig.json",
    "themis.config.json",
    "src",
    "tests",
    "docs",
    "examples/osdk-client-example.ts",
    "examples/eval-handoff-example.ts",
    "examples/eval-handoff-example.json",
    "examples/osdk-react-app/README.md",
    "examples/osdk-react-app/dist",
    "assets",
  ];

  for (const relativePath of includePaths) {
    await copyIntoBundle(relativePath);
  }

  const rootPackage = JSON.parse(await readFile(join(rootDir, "package.json"), "utf8"));
  const manifest = {
    name: bundleName,
    generatedAt: new Date().toISOString(),
    packageVersion: rootPackage.version,
    packageAuthor: rootPackage.author ?? null,
    includedPaths: includePaths,
    commands: [
      "npm install",
      "npm run generate",
      "npm test",
      "npm run demo:osdk",
      "npm run demo:handoff",
      "cd examples/osdk-react-app && npm install && npm run dev",
    ],
    notes: [
      "This bundle is a curated demo artifact for local review and registry-style sharing.",
      "The React app ships as a prebuilt dist artifact under examples/osdk-react-app/dist.",
    ],
  };

  await writeFile(
    join(stagingDir, "community-package.json"),
    JSON.stringify(manifest, null, 2),
  );

  await writeFile(
    join(stagingDir, "INSTALL.md"),
    [
      "# Demo Install",
      "",
      "1. Review `README.md` for repo context.",
      "2. Run `npm install` at the bundle root.",
      "3. Run `npm run generate` and `npm test`.",
      "4. Run `npm run demo:osdk` and `npm run demo:handoff`.",
      "5. Inspect the prebuilt UI at `examples/osdk-react-app/dist/index.html` or run the app locally from source.",
      "",
    ].join("\n"),
  );

  await rm(zipPath, { force: true });
  await run("zip", ["-r", basename(zipPath), bundleName], releaseRoot);

  process.stdout.write(`\nCreated demo bundle:\n${zipPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
