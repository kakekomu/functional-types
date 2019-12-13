import { Ok, Err } from "@kakekomu/result-type"
import {
  isString,
  min,
  max,
  length,
  regex,
  hasLowcase,
  hasUpcase,
  hasNumber,
  onlyNumbers,
  isEmail,
  separated
} from "../src/string"
import { many } from "../src/core"

describe("string validators", () => {
  describe("isString", () => {
    const validator = isString("not a string")

    it("succeeds when is string", () =>
      expect(validator("string")).toEqual(Ok("string")))

    it("fails when not string", () =>
      expect(validator(1)).toEqual(Err(["not a string"])))
  })

  describe("min", () => {
    const validator = min("too short", 4)

    it("succeeds when is longer than 4", () =>
      expect(validator("1234")).toEqual(Ok("1234")))

    it("fails when shorter than 4", () =>
      expect(validator("123")).toEqual(Err(["too short"])))
  })

  describe("max", () => {
    const validator = max("too long", 4)

    it("succeeds when is shorter than 4", () =>
      expect(validator("1234")).toEqual(Ok("1234")))

    it("fails when longer than 4", () =>
      expect(validator("12345")).toEqual(Err(["too long"])))
  })

  describe("regex", () => {
    const validator = regex("no lowercase letters", /[a-z]/)
    const validatorStr = regex("no lowercase letters", "[a-z]")

    it("succeeds when regex matches", () => {
      const expected = Ok("abcABC123")
      expect(validator("abcABC123")).toEqual(expected)
      expect(validatorStr("abcABC123")).toEqual(expected)
    })

    it("fails when regex doesn't match", () => {
      const expected = Err(["no lowercase letters"])
      expect(validator("ABC123")).toEqual(expected)
      expect(validatorStr("ABC123")).toEqual(expected)
    })
  })
})

describe("regex based", () => {
  const numberValidator = hasNumber("no numbers")

  it("succeeds when has at least 1 number", () =>
    expect(numberValidator("a2bc")).toEqual(Ok("a2bc")))

  it("fails when has no numbers", () =>
    expect(numberValidator("abc")).toEqual(Err(["no numbers"])))

  const numberValidator2 = hasNumber("not enough numbers", 2)

  it("succeeds when has the required amount of numbers", () =>
    expect(numberValidator2("a2bc1")).toEqual(Ok("a2bc1")))

  it("fails when has less than required amount of numbers", () =>
    expect(numberValidator2("a2bc")).toEqual(Err(["not enough numbers"])))

  const emailValidator = isEmail("invalid email")

  it("succeeds when email is valid", () =>
    expect(emailValidator("abc@abc.com")).toEqual(Ok("abc@abc.com")))

  it("fails when email is invalid", () =>
    expect(emailValidator("abc@abc")).toEqual(Err(["invalid email"])))
})

describe("composed validators", () => {
  const passwordValidator = many([
    hasLowcase("no lowercase letters"),
    hasUpcase("no uppercase letters"),
    hasNumber("no numbers"),
    min("less than 5 chars", 5)
  ])

  it("succeeds when meets password criteria", () => {
    expect(passwordValidator("abCD1")).toEqual(Ok("abCD1"))
  })

  it("fails when has no numbers", () => {
    expect(passwordValidator("abCDE")).toEqual(Err(["no numbers"]))
  })

  it("fails when has nothing but numbers", () => {
    expect(passwordValidator("1234")).toEqual(
      Err(["no lowercase letters", "no uppercase letters", "less than 5 chars"])
    )
  })

  const phoneNumberValidator = separated(
    "invalid amount of number blocks",
    "-",
    [3, 3].map(digits =>
      many([
        onlyNumbers("not a number"),
        length("invalid amount of digits", digits)
      ])
    )
  )

  it("succeeds when is a phone number", () =>
    expect(phoneNumberValidator("123-123")).toEqual(Ok("123-123")))

  it("fails when phone number is invalid (letter)", () =>
    expect(phoneNumberValidator("123-a23")).toEqual(Err(["not a number"])))

  it("fails when phone number is invalid (invalid amount of digits)", () =>
    expect(phoneNumberValidator("123-12")).toEqual(
      Err(["invalid amount of digits"])
    ))

  it("fails when phone number is invalid (invalid amount of blocks)", () =>
    expect(phoneNumberValidator("123-123-123")).toEqual(
      Err(["invalid amount of number blocks"])
    ))
})
