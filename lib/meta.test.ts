import { describe, expect, it } from "bun:test"

import { reflectMeta } from "./meta"
import { testPack } from "./test-config"

describe("meta", () => {
  it("should reflect the correct meta", () => {
    expect(reflectMeta(testPack)).toEqual({
      pack: {
        description: testPack.description,
        pack_format: testPack.format,
        supported_formats: testPack.supports,
      },
    })
  })
})
