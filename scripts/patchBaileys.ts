import { writeFile } from "fs/promises";
import { join } from "path";
import { $ } from "bun";

const base = "node_modules/baileys";
const tsconfigPath = join(base, "tsconfig.json");

const overrideConfig = {
  compilerOptions: {
    target: "esnext",
    module: "CommonJS",
    allowJs: true,
    noCheck: true,
    outDir: "lib",
    noEmitOnError: false,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: false,
    declaration: false,
    lib: ["esnext"],
    resolveJsonModule: true
  },
  include: ["src/**/*.ts", "src/**/*.json"]
};

await writeFile(tsconfigPath, JSON.stringify(overrideConfig, null, 2));

await $`bunx tsc --project ${tsconfigPath}`;