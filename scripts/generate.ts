import { Command } from "commander"
import { basename, join } from "path"

import { format } from "../lib/build"

const generatePackConfig = (directory: string, options?: Partial<PackConfig>) => ({
  id: options?.id ?? `@namespace/${basename(directory)}`,
  version: options?.version ?? "0.0.1",
  title: options?.title ?? `${basename(directory)}`,
  description: options?.description ?? "Hello, World!",
  icon: options?.icon ?? {
    item: "minecraft:dirt",
  },
  engine: options?.engine ?? "@release",
})

const program = new Command("generate")
  .description("create a new pack.cts")
  .argument("<directory>", "path to the datapack project")
  .action(async (directory) => {
    Bun.write(
      join(directory, "pack.cts"),
      await format(`export default ${JSON.stringify(generatePackConfig(directory))} satisfies PackConfig`),
      { createPath: true },
    )
  })
program.parse()
