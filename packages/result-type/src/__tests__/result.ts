import { Err, Ok } from ".."
import * as Result from ".."

describe("Result.withDefault", () => {
  test("Err value with default", () => {
    expect(Result.withDefault(Err("error"), "default")).toEqual("default")
  })

  test("Ok value with default", () => {
    expect(Result.withDefault(Ok("value"), "default")).toEqual("value")
  })
})

describe("Result.fromNullable", () => {
  test("convert an undefined value to Result", () => {
    expect(Result.fromNullable(undefined, "error")).toEqual(Err("error"))
  })

  test("convert an null value to Result", () => {
    expect(Result.fromNullable(null, "error")).toEqual(Err("error"))
  })

  test("convert a NaN value to Result", () => {
    expect(Result.fromNullable(NaN, "error")).toEqual(Err("error"))
  })

  test("convert a non null value to Result", () => {
    expect(Result.fromNullable("value", "error")).toEqual(Ok("value"))
  })
})

describe("Result.fromGuarded", () => {
  const testedValue: unknown = 1

  test("test a value with a guard - fail", () => {
    expect(
      Result.fromGuarded(
        testedValue,
        "error",
        (x: unknown): x is string => typeof x === "string"
      )
    ).toEqual(Err("error"))
  })

  test("test a value with a guard - succeed", () => {
    expect(
      Result.fromGuarded(
        testedValue,
        "error",
        (x: unknown): x is number => typeof x === "number"
      )
    ).toEqual(Ok(1))
  })
})

describe("Result.join", () => {
  test("join where the nested Result is Err", () => {
    expect(Result.join(Ok(Err("error")))).toEqual(Err("error"))
  })

  test("join on an Err", () => {
    expect(Result.join(Err("error"))).toEqual(Err("error"))
  })

  test("join where both values are Ok", () => {
    expect(Result.join(Ok(Ok("value")))).toEqual(Ok("value"))
  })
})

describe("Result.map", () => {
  const func = (val: string) => val + "!"

  test("mapping a Err value", () => {
    expect(Result.map(Err("error"), func)).toEqual(Err("error"))
  })

  test("mapping a Ok value", () => {
    expect(Result.map(Ok("value"), func)).toEqual(Ok("value!"))
  })
})

describe("Result.mapErr", () => {
  const func = (val: string) => val + "!"

  test("mapping a Err value", () => {
    expect(Result.mapErr(Err("error"), func)).toEqual(Err("error!"))
  })

  test("mapping a Ok value", () => {
    expect(Result.mapErr(Ok("value"), func)).toEqual(Ok("value"))
  })
})

describe("Result.mapBoth", () => {
  const fErr = (val: string) => val + "!"
  const fVal = (val: number) => val + 10

  test("mapping a Err value", () => {
    expect(Result.mapBoth(Err("error"), fErr, fVal)).toEqual(Err("error!"))
  })

  test("mapping a Ok value", () => {
    expect(Result.mapBoth(Ok(10), fErr, fVal)).toEqual(Ok(20))
  })
})
describe("Result.andThen", () => {
  const func = (val: string) => Ok(val + "!")
  test("mapping a Err value", () => {
    expect(Result.andThen(Err("error"), func)).toEqual(Err("error"))
  })

  test("mapping a Ok value", () => {
    expect(Result.andThen(Ok("value"), func)).toEqual(Ok("value!"))
  })
})

describe("Result.mapMany", () => {
  const func = (str: string, num: number, bool: boolean) =>
    `${str}${num}${bool}`
  test("mapping with a Err value", () => {
    expect(Result.mapMany([Ok("a"), Err("error"), Ok(true)], func)).toEqual(
      Err("error")
    )
  })

  test("mapping only Ok values", () => {
    expect(Result.mapMany([Ok("a"), Ok(1), Ok(true)], func)).toEqual(
      Ok("a1true")
    )
  })
})

describe("Result.ap", () => {
  test("applying a Err value", () => {
    expect(Result.ap(Ok(5), Err("error"))).toEqual(Err("error"))
  })

  test("applying a Ok value", () => {
    expect(
      Result.ap(
        Ok(5),
        Ok((num: number) => num + 5)
      )
    ).toEqual(Ok(10))
  })
})

describe("Result.sequence", () => {
  test("sequence over a list of Ok values", () => {
    expect(Result.sequence([Ok(5), Ok(4), Ok(3)])).toEqual(Ok([5, 4, 3]))
  })

  test("sequence over a list with a Err value", () => {
    expect(Result.sequence([Ok(5), Err("error"), Ok(3)])).toEqual(Err("error"))
  })
})
