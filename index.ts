import { mkdir } from "node:fs/promises"

import { zipPack } from "./lib/build"
import { reflectPack } from "./lib/config"
import { usingLogger } from "./lib/logger"
import { formatBytes } from "./lib/utils"
import { name, version } from "./package.json"

const packs = new Bun.Glob("./src/**/pack.cts")

await mkdir("./dist", { recursive: true })

const log = Bun.file("./dist/log.txt")
await usingLogger(log, async (logger) => {
  logger.log(`${name}@${version}`)
  let bytesWritten = 0

  for await (const path of packs.scan({ absolute: true })) {
    const pack = await reflectPack(path)
    const zipSize = await zipPack(pack)
    bytesWritten += zipSize

    logger.log(`wrote ${formatBytes(zipSize)} to ${pack.codename}.zip`)
  }
  logger.log(`wrote a total of ${formatBytes(bytesWritten)} to dist`)
})
