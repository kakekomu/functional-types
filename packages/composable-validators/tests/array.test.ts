import { length, every, each } from "../src/array"
import { Ok, Err } from "@kakekomu/result-type"
import * as string from "../src/string"

describe("array validators", () => {
  describe("basic validators", () => {
    const lengthValidator = length("invalid array length", 5)
    it("succeeds when array length matches", () =>
      expect(lengthValidator([1, 2, 3, 4, 5])).toEqual(Ok([1, 2, 3, 4, 5])))

    it("fails when array length doesn't match", () => {
      const validated = lengthValidator([1, 2, 3, 4])
      expect(validated).toEqual(Err(["invalid array length"]))
    })
  })

  describe("every validator", () => {
    const maxValidator = every(string.max("too long", 4))
    it("succeeds when every element of the array succeeds", () =>
      expect(maxValidator(["abc", "def", "ghi"])).toEqual(
        Ok(["abc", "def", "ghi"])
      ))

    it("fails when any of the array fails", () =>
      expect(maxValidator(["abc", "defdef", "ghi"])).toEqual(Err(["too long"])))
  })
  describe("each validator", () => {
    const tupleValidator = each("invalid array length", [
      string.max("too long", 4),
      string.min("too short", 4),
      string.onlyNumbers("not a number")
    ])
    it("succeeds when every element of the array succeeds", () =>
      expect(tupleValidator(["abc", "abcd", "123"])).toEqual(
        Ok(["abc", "abcd", "123"])
      ))

    it("fails when array length doesn't match", () => {
      const validated = tupleValidator(["abc", "abcd"])
      expect(validated).toEqual(Err(["invalid array length"]))
    })

    it("fails when every any of the array fails", () => {
      const validated = tupleValidator(["abc", "abc", "abc"])
      expect(validated).toEqual(Err(["too short", "not a number"]))
    })
  })
})
