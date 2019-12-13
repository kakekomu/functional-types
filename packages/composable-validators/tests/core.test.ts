import { Ok, Err } from "@kakekomu/result-type"
import { Validator, Validated, custom, compose, many, not } from "../src/core"

const fail = <T>(errorMsg: string) => (_: T): Validated<T> => Err([errorMsg])

const succeed = <T>(value: T): Validated<T> => Ok(value)

describe("custom validator", () => {
  it("succeeds when predicate is true", () => {
    const isOne: Validator<number> = custom(
      value => value === 1,
      "validation error"
    )
    expect(isOne(1)).toEqual(Ok(1))
  })

  it("fails when predicate is false", () => {
    const isTwo: Validator<number> = custom(
      value => value === 2,
      "validation error"
    )
    expect(isTwo(1)).toEqual(Err(["validation error"]))
  })
})

describe("compose", () => {
  it("succeeds when both validators succeed", () =>
    expect(compose(succeed, succeed)(1)).toEqual(Ok(1)))

  it("fails when both validators fail", () =>
    expect(
      compose(
        fail("validation error on 1st"),
        fail("validation error on 2nd")
      )(1)
    ).toEqual(Err(["validation error on 1st", "validation error on 2nd"])))

  it("fails when one of the validators fails", () =>
    expect(compose(succeed, fail("validation error"))(1)).toEqual(
      Err(["validation error"])
    ))
})

describe("many", () => {
  it("succeeds when all validators succeed", () =>
    expect(many([succeed, succeed, succeed])(1)).toEqual(Ok(1)))

  it("fails when all validators fail", () =>
    expect(
      many([
        fail("validation error on 1st"),
        fail("validation error on 2nd"),
        fail("validation error on 3rd")
      ])(1)
    ).toEqual(
      Err([
        "validation error on 1st",
        "validation error on 2nd",
        "validation error on 3rd"
      ])
    ))

  it("fails when one of the validators fail", () =>
    expect(
      many([succeed, fail("validation error on 2nd"), succeed])(1)
    ).toEqual(Err(["validation error on 2nd"])))
})

describe("logical NOT combinator", () => {
  it("succeeds when the validator succeeds", () =>
    expect(not("validation error", fail("validation error"))(1)).toEqual(Ok(1)))

  it("fails when the string contains upper case letters", () =>
    expect(not("validation error", succeed)(1)).toEqual(
      Err(["validation error"])
    ))
})
