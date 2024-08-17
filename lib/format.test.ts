import { describe, expect, it } from "bun:test"

import manifest from "../assets/version-manifest.json"
import { isMinecraftTag, isMinecraftVersion, tagToVersion } from "./format"

describe("format", () => {
  it("should detect valid versions", () => {
    expect(isMinecraftVersion("1.18.1")).toBeTruthy()
  })
  it("should detect invalid versions", () => {
    expect(isMinecraftVersion("2.1.5")).toBeFalsy()
  })
  it("should detect valid tags", () => {
    expect(isMinecraftTag("@release")).toBeTruthy()
  })
  it("should detect invalid tags", () => {
    expect(isMinecraftTag("@beta")).toBeFalsy()
  })

  it("should reflect the correct @release tag", () => {
    expect(tagToVersion("@release")).toBe(manifest.latest["@release"] as Minecraft.Version)
  })
  it("should reflect the correct @snapshot tag", () => {
    expect(tagToVersion("@snapshot")).toBe(manifest.latest["@snapshot"] as Minecraft.Version)
  })
})
