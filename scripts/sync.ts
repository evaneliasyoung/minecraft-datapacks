import { Command } from "commander"

import { syncPack } from "../lib/build"
import { reflectPack } from "../lib/config"

const program = new Command("sync").description("syncs pack.cts to datapack content").action(async () => {
  const packs = new Bun.Glob("./**/pack.cts")

  for await (const path of packs.scan({ absolute: true })) {
    const pack = await reflectPack(path)

    await syncPack(pack)
    console.log(`synced ${pack.codename}`)
  }
})
program.parse()
