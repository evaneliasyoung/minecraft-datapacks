import { existsSync } from "fs"
import { dirname, join } from "path"

import { engineToFormat } from "./format"

const getAssets = (dir: string): string | undefined => {
  const candidate = join(dir, "assets")
  if (existsSync(join(dir, "package.json")) && existsSync(candidate)) return candidate

  const next = dirname(dir)
  return next === dir ? undefined : getAssets(next)
}

export const isPackID = (id: unknown): id is PackID =>
  typeof id === "string" && id.startsWith("@") && id.indexOf("/") === id.lastIndexOf("/")

export const reflectID = (id: PackID): [string, string] => {
  if (!isPackID(id)) throw Error(`invalid id: ${id}`)
  return id.slice(1).split("/") as [string, string]
}

export const reflectDescription = ({ version, description }: Pick<PackConfig, "version" | "description">) =>
  typeof description === "string" ? `${description} v${version}` : description

export const reflectConfig = ({ id, version, description, engine, ...pack }: PackConfig) => {
  const [namespace, codename] = reflectID(id)

  return {
    namespace,
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
