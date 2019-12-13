import { Ok, Err } from "@kakekomu/result-type"
import * as number from "../src/number"

describe("number validators", () => {
  describe("isNumber", () => {
    const isNumber = number.isNumber("not a number")

    it("succeeds when is number", () => expect(isNumber(123)).toEqual(Ok(123)))

    it("fails when not number", () =>
      expect(isNumber(false)).toEqual(Err(["not a number"])))
  })

  describe("min", () => {
    const min = number.min("too small", 400)

    it("succeeds when is larger than or equal to 4", () =>
      expect(min(400)).toEqual(Ok(400)))

    it("fails when smaller than 4", () =>
      expect(min(399)).toEqual(Err(["too small"])))
  })

  describe("max", () => {
    const max = number.max("too large", 400)

    it("succeeds when is smaller than or equal to 4", () =>
      expect(max(400)).toEqual(Ok(400)))

    it("fails when longer than 4", () =>
      expect(max(401)).toEqual(Err(["too large"])))
  })
})
