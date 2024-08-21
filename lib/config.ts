import { existsSync } from "fs"
import { dirname, join } from "path"

import { engineToFormat } from "./format"

const getAssets = (dir: string): string | undefined => {
  const candidate = join(dir, "assets")
  if (existsSync(join(dir, "package.json")) && existsSync(candidate)) return candidate

  const next = dirname(dir)
  return next === dir ? undefined : getAssets(next)
}

export const isPackID = (id: unknown): id is PackID => typeof id === "string" && id.startsWith("@") && id.includes("/")

export const reflectID = (id: PackID) => {
  if (!isPackID(id)) throw Error(`invalid id: ${id}`)
  return id.slice(1).split("/") as [string, string] | [string, string, string]
}

export const reflectDescription = ({ version, description }: Pick<PackConfig, "version" | "description">) =>
  typeof description === "string" ? `${description} v${version}` : description

export const reflectConfig = ({ id, version, description, engine, ...pack }: PackConfig): Omit<Pack, "root"> => {
  const [namespace, ...groups] = reflectID(id)
  const [group, codename] = groups.length === 2 ? groups : [undefined, groups[0]]

  return {
    namespace,
    group,
    codename,
    description: reflectDescription({ version, description }),
    format: engineToFormat(engine),
    ...pack,
  }
}

export const reflectPack = async (path: string): Promise<Pack> => ({
  root: dirname(path),
  assets: getAssets(path),
  ...reflectConfig((await import(path)).default as PackConfig),
})
