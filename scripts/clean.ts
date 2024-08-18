import { $ } from "bun"

import { Command } from "commander"

const program = new Command("clean").description("removes build and version artifacts").action(async () => {
  await $`rm -rf dist assets/version-manifest.json @types/verison.d.ts`
})
program.parseAsync()
