import { mkdir } from "node:fs/promises"

import { zipPack } from "./lib/build"
import { reflectPack } from "./lib/config"
import { usingLogger } from "./lib/logger"
import { name, version } from "./package.json"

const packs = new Bun.Glob("./src/**/pack.cts")

await mkdir("./dist", { recursive: true })

const log = Bun.file("./dist/log.txt")
await usingLogger(log, async (logger) => {
  logger.log(`${name}@${version}`)

  for await (const path of packs.scan({ absolute: true })) {
    const pack = await reflectPack(path)

    await zipPack(pack, logger)
  }
})
