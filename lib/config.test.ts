import { describe, expect, it } from "bun:test"

import { isPackID, reflectConfig, reflectDescription, reflectID } from "./config"
import { testConfig, testPack } from "./test-config"

describe("config", () => {
  it("should detect valid ids", () => {
    expect(isPackID("@namespace/test")).toBeTruthy()
  })
  it("should detect invalid ids", () => {
    expect(isPackID("namespace.test")).toBeFalsy()
  })

  it("should reflect valid ids", () => {
    expect(reflectID("@namespace/test")).toEqual(["namespace", "test"])
  })

  it("should fail to reflect invalid ids", () => {
    expect(() => reflectID("namespace.test" as PackID)).toThrow("invalid id: namespace.test")
  })

  it("should reflect the correct description", () => {
    expect(reflectDescription({ description: "test", version: "0.1" })).toEqual("test v0.1")
  })

  it("should reflect the correct config", () => {
    expect(reflectConfig(testConfig)).toEqual(testPack)
  })
})
