import archiver from "archiver"
import { createReadStream, createWriteStream } from "fs"
import { join } from "path"

import { createAdvancements } from "./advancements"
import { reflectMeta } from "./meta"

export const writeObject = async (path: string, object: object) =>
  await Bun.write(path, JSON.stringify(object, undefined, 2), { createPath: true })

export async function syncPack(pack: Pack) {
  const patchFiles = async (...patches: [string[], Minecraft.Advancement][]) =>
    await Promise.all(patches.map(([parts, data]) => writeObject(join(pack.root, ...parts), data)))

  const advancementPath = ["data", "global", "advancement"]
  const [root, namespace, group, base] = await createAdvancements(pack)

  const filesToPatch = [
    [["pack.mcmeta"], reflectMeta(pack)],
    [[...advancementPath, "root.json"], root],
    [[...advancementPath, `${pack.namespace}.json`], namespace],
    [[...advancementPath, `${pack.codename}.json`], base],
  ] as [string[], Minecraft.Advancement][]

  if (group) filesToPatch.push([[...advancementPath, `${pack.group}.json`], group] as const)

  await patchFiles(...filesToPatch)
}

export async function zipPack(pack: Pack): Promise<number> {
  return new Promise((resolve, reject) => {
    const filename = `${pack.codename}.zip`
    const output = createWriteStream(`./dist/${filename}`)
    const archive = archiver("zip", {
      zlib: { level: 9 },
    })

    output.on("close", () => resolve(archive.pointer()))
    archive.on("warning", reject)
    archive.on("error", reject)

    archive.pipe(output)

    const glob = new Bun.Glob("**/*")
    const scannedFiles = glob.scanSync({ absolute: true, cwd: pack.root })
    for (const path of scannedFiles) archive.append(createReadStream(path), { name: path.replace(pack.root, "") })

    archive.finalize()
  })
}
