import archiver from "archiver"
import { createReadStream, createWriteStream } from "fs"
import { join } from "path"
import { type BuiltInParserName, type LiteralUnion, format as prettierFormat } from "prettier"

import prettier from "../.prettierrc"
import { createAdvancements } from "./advancements"
import type { Logger } from "./logger"
import { reflectMeta } from "./meta"

export const format = async (code: string, parser?: LiteralUnion<BuiltInParserName>) =>
  await prettierFormat(code, { ...prettier, plugins: [], parser: parser ?? "typescript" })

export const writeObject = async (path: string, object: object) =>
  await Bun.write(path, await format(JSON.stringify(object, undefined, 2), "json"), { createPath: true })

export async function syncPack(pack: Pack) {
  const patchFiles = async (...patches: [string[], object][]) =>
    await Promise.all(patches.map(([parts, data]) => writeObject(join(pack.root, ...parts), data)))

  const advancementPath = ["data", "global", "advancements"]
  const [root, namespace, base] = await createAdvancements(pack)

  await patchFiles(
    [["pack.mcmeta"], reflectMeta(pack)],
    [[...advancementPath, "root.json"], root],
    [[...advancementPath, `${pack.namespace}.json`], namespace],
    [[...advancementPath, `${pack.codename}.json`], base],
  )
}

export async function zipPack(pack: Pack, logger: Logger): Promise<void> {
  const filename = `${pack.codename}.zip`
  const output = createWriteStream(`./dist/${filename}`)
  const archive = archiver("zip", {
    zlib: { level: 9 },
  })

  output.on("close", function () {
    let size = archive.pointer()
    let add = "B"
    if (size > 1024) [size, add] = [size / 1024, "KB"]
    if (size > 1024) [size, add] = [size / 1024, "MB"]
    if (size > 1024) [size, add] = [size / 1024, "GB"]

    logger.log(`wrote ${size.toFixed(2)} ${add} to ${filename}`)
  })

  output.on("end", () => logger.log("Data has been drained"))

  archive.on("warning", (err) => {
    throw err
  })

  archive.on("error", (err) => {
    throw err
  })

  archive.pipe(output)

  for await (const res of new Bun.Glob("**/*").scan({ absolute: true, cwd: pack.root })) {
    archive.append(createReadStream(res), { name: res.replace(pack.root, "") })
  }

  await archive.finalize()
}
