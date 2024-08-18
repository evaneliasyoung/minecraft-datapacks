import { describe, expect, it } from "bun:test"

import { createRootAdvancement } from "./advancements"
import { testPack } from "./test-config"

describe("advancements", () => {
  it("should reflect valid root achievement", async () => {
    expect(createRootAdvancement(testPack)).resolves.toEqual({
      display: {
        title: "Installed Datapacks",
        description: "",
        icon: {
          id: "minecraft:knowledge_book",
        },
        background: "minecraft:textures/block/gray_concrete.png",
        show_toast: false,
        announce_to_chat: false,
      },
      criteria: {
        trigger: {
          trigger: "minecraft:tick",
        },
      },
    })
  })
})
