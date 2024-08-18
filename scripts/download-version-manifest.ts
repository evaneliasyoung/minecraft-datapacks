import { Command } from "commander"

import { format, writeObject } from "../lib/build"

const SOURCE = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json"

type FullVersionManifestEntry = {
  id: string
  type: string
  url: string
  time: string
  releaseTime: string
  sha1: string
  complianceLevel: 0 | 1
}

type VersionManifestEntry = {
  id: string
  type: string
  releaseTime: string
  packFormat: Minecraft.DataPack.Format
}

type VersionManifest<Full extends boolean = false> = {
  latest: Record<string, string>
  versions: (Full extends true ? FullVersionManifestEntry : VersionManifestEntry)[]
}

const fetchVersionManifest = async () => (await (await fetch(SOURCE)).json()) as VersionManifest<true>

const INCREMENT_PACK_FMT_VERSIONS = new Set([
  "1.15-pre1",
  "1.16.2-rc1",
  "20w46a",
  "21w37a",
  "1.18.2-pre1",
  "22w11a",
  "23w03a",
  "23w06a",
  "23w12a",
  "23w16a",
  "23w18a",
  "23w31a",
  "23w32a",
  "1.20.2-pre1",
  "23w40a",
  "23w41a",
  "23w42a",
  "23w43a",
  "23w44a",
  "23w45a",
  "23w46a",
  "1.20.3-pre1",
  "23w51a",
  "24w03a",
  "24w04a",
  "24w05a",
  "24w06a",
  "24w07a",
  "24w09a",
  "24w10a",
  "24w11a",
  "24w12a",
  "24w13a",
  "24w14a",
  "1.20.5-pre1",
  "1.20.5-pre2",
  "1.20.5-pre3",
  "24w18a",
  "24w19a",
  "24w20a",
  "24w21a",
  "1.21-pre1",
  "1.21-pre2",
  "1.21-pre3",
  "24w33a"
])

const mapVersionManifest = ({ latest: rawLatest, versions: rawVersions }: VersionManifest<true>): VersionManifest => {
  let packFormat: Minecraft.DataPack.Format = 4

  return {
    latest: Object.fromEntries(Object.entries(rawLatest).map(([type, version]) => [`@${type}`, version])),
    versions: rawVersions
      .filter(({ releaseTime }) => new Date(releaseTime) >= new Date("2017-11-27T15:36:33+00:00"))
      .toReversed()
      .map(({ id, type, releaseTime }) => {
        if (INCREMENT_PACK_FMT_VERSIONS.has(id)) packFormat += 1
        return { id, type, releaseTime, packFormat }
      })
      .toReversed(),
  }
}

async function makeVersionTypeDeclarations({ latest, versions }: VersionManifest) {
  const releases = versions.filter(({ type }) => type === "release").map(({ id }) => id)
  const snapshots = versions.filter(({ type }) => type === "snapshot").map(({ id }) => id)

  const toLiteral = (str: string) => '"' + str + '"'
  const pipe = " | "

  const versionTypings = [
    `declare namespace Minecraft {`,
    `  type Version = Version.Release | Version.Snapshot`,
    ``,
    `  namespace Version {`,
    `    type Tag = ${Object.keys(latest).map(toLiteral).join(pipe)}`,
    ``,
    `    type Release = ${releases.map(toLiteral).join(pipe)}`,
    ``,
    `    type Snapshot = ${snapshots.map(toLiteral).join(pipe)}`,
    `  }`,
    `}`,
  ]

  return await format(versionTypings.join("\n"))
}

const program = new Command("update-version-manifest")
  .description("update version manifest and version types")
  .option("-f, --force", "force updating the manifest and types")
  .action(async (options) => {
    if (options.force !== true && (await Bun.file("./assets/version-manifest.json").exists())) return

    const rawVersionManifest = await fetchVersionManifest()
    const versionManifest = mapVersionManifest(rawVersionManifest)

    await Promise.all([
      Bun.write("./@types/version.d.ts", await makeVersionTypeDeclarations(versionManifest), { createPath: true }),
      writeObject("./assets/version-manifest.json", versionManifest),
    ])

    console.log("Success! updated manifest and types")
  })
program.parseAsync()
