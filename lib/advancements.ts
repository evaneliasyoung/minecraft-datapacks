import { exists } from "fs/promises"
import { join } from "path"

const DISPLAY_BASE = {
  show_toast: false,
  announce_to_chat: false,
}

const criteria = {
  trigger: {
    trigger: "minecraft:tick",
  },
}

const reflectIfExists = async (assets: string | undefined, filename: string) =>
  assets !== undefined && (await exists(join(assets, filename)))
    ? await Bun.file(join(assets, filename)).json()
    : undefined

export const createRootAdvancement = async ({ assets }: Pack) =>
  (await reflectIfExists(assets, "root.json")) ?? {
    display: {
      title: "Installed Datapacks",
      description: "",
      icon: {
        id: "minecraft:knowledge_book",
      },
      background: "minecraft:textures/block/gray_concrete.png",
      ...DISPLAY_BASE,
    },
    criteria,
  }

export const createNamespaceAdvancement = async ({ assets, namespace }: Pack) =>
  (await reflectIfExists(assets, `${namespace}.json`)) ?? {
    display: {
      title: "Minecraft Username",
      description: "",
      icon: {
        id: "minecraft:player_head",
      },
      parent: "global:root",
      ...DISPLAY_BASE,
    },
    criteria,
  }

export const createPackAdvancement = async ({ title, description, icon, namespace }: Pack) => ({
  display: { title, description, icon, ...DISPLAY_BASE },
  parent: `global:${namespace}`,
  criteria,
})

export const createAdvancements = async (pack: Pack): Promise<[object, object, object]> =>
  await Promise.all([createRootAdvancement(pack), createNamespaceAdvancement(pack), createPackAdvancement(pack)])
