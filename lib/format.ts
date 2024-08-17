import manifest from "../assets/version-manifest.json"

export const isMinecraftVersion = (version?: unknown): version is Minecraft.Version =>
  typeof version === "string" && manifest.versions.map(({ id }) => id).includes(version)

export const isMinecraftTag = (tag?: unknown): tag is Minecraft.Version.Tag =>
  typeof tag === "string" && tag.startsWith("@") && tag in manifest.latest

export function tagToVersion(tag: Minecraft.Version.Tag): Minecraft.Version {
  if (isMinecraftTag(tag)) return manifest.latest[tag] as Minecraft.Version
  throw Error(`unsupported tag: ${tag}`)
}

export function tagToFormat(tag: Minecraft.Version.Tag): Minecraft.DataPack.Format {
  return versionToFormat(tagToVersion(tag))
}

export function versionToFormat(version: Minecraft.Version): Minecraft.DataPack.Format {
  return manifest.versions.find(({ id }) => id === version)!.packFormat as Minecraft.DataPack.Format
}

export function engineToFormat(engine: Minecraft.Version.Tag | Minecraft.Version): Minecraft.DataPack.Format {
  if (isMinecraftTag(engine)) return tagToFormat(engine)
  else if (isMinecraftVersion(engine)) return versionToFormat(engine)
  throw Error(`unsupported engine: ${engine}`)
}
