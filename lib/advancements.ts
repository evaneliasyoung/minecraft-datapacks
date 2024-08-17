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
        item: "minecraft:knowledge_book",
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
        item: "minecraft:player_head",
        nbt: `{Id:[682268746,544686284,-1914182079,-1376598889],Properties:{textures:[{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDZiYTYzMzQ0ZjQ5ZGQxYzRmNTQ4OGU5MjZiZjNkOWUyYjI5OTE2YTZjNTBkNjEwYmI0MGE1MjczZGM4YzgyIn19fQ=="}]}}`,
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
