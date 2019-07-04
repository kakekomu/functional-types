import { Failure, Loading, NotAsked, Success } from "../remote-data"
import * as Remote from "../remote-data"

describe("Remote.withDefault", () => {
  test("NotAsked value with default", () => {
    expect(Remote.withDefault(NotAsked(), "default")).toEqual("default")
  })

  test("Loading value with default", () => {
    expect(Remote.withDefault(Loading(), "default")).toEqual("default")
  })

  test("Failure value with default", () => {
    expect(Remote.withDefault(Failure("error"), "default")).toEqual("default")
  })

  test("Success value with default", () => {
    expect(Remote.withDefault(Success("value"), "default")).toEqual("value")
  })
})

describe("Remote.fromNullable", () => {
  test("convert an undefined value to RemoteData", () => {
    expect(Remote.fromNullable(undefined, "error")).toEqual(Failure("error"))
  })

  test("convert an null value to RemoteData", () => {
    expect(Remote.fromNullable(null, "error")).toEqual(Failure("error"))
  })

  test("convert a non null value to RemoteData", () => {
    expect(Remote.fromNullable("value", "error")).toEqual(Success("value"))
  })
})

describe("Remote.map", () => {
  const func = (val: string) => val + "!"

  test("mapping a NotAsked value", () => {
    expect(Remote.map(NotAsked(), func)).toEqual(NotAsked())
  })

  test("mapping a Loading value", () => {
    expect(Remote.map(Loading(), func)).toEqual(Loading())
  })

  test("mapping a Failure value", () => {
    expect(Remote.map(Failure("error"), func)).toEqual(Failure("error"))
  })

  test("mapping a Success value", () => {
    expect(Remote.map(Success("value"), func)).toEqual(Success("value!"))
  })
})

describe("Remote.mapFailure", () => {
  const func = (val: string) => val + "!"

  test("mapping a NotAsked value", () => {
    expect(Remote.mapFailure(NotAsked(), func)).toEqual(NotAsked())
  })

  test("mapping a Loading value", () => {
    expect(Remote.mapFailure(Loading(), func)).toEqual(Loading())
  })

  test("mapping a Failure value", () => {
    expect(Remote.mapFailure(Failure("error"), func)).toEqual(Failure("error!"))
  })

  test("mapping a Success value", () => {
    expect(Remote.mapFailure(Success("value"), func)).toEqual(Success("value"))
  })
})

describe("Remote.mapBoth", () => {
  const fErr = (val: string) => val + "!"
  const fVal = (val: number) => val + 10

  test("mapping a NotAsked value", () => {
    expect(Remote.mapBoth(NotAsked(), fErr, fVal)).toEqual(NotAsked())
  })

  test("mapping a Loading value", () => {
    expect(Remote.mapBoth(Loading(), fErr, fVal)).toEqual(Loading())
  })

  test("mapping a Failure value", () => {
    expect(Remote.mapBoth(Failure("error"), fErr, fVal)).toEqual(
      Failure("error!")
    )
  })

  test("mapping a Success value", () => {
    expect(Remote.mapBoth(Success(10), fErr, fVal)).toEqual(Success(20))
  })
})
describe("Remote.andThen", () => {
  const func = (val: string) => Success(val + "!")
  test("mapping a NotAsked value", () => {
    expect(Remote.andThen(NotAsked(), func)).toEqual(NotAsked())
  })

  test("mapping a Loading value", () => {
    expect(Remote.andThen(Loading(), func)).toEqual(Loading())
  })

  test("mapping a Failure value", () => {
    expect(Remote.andThen(Failure("error"), func)).toEqual(Failure("error"))
  })

  test("mapping a Success value", () => {
    expect(Remote.andThen(Success("value"), func)).toEqual(Success("value!"))
  })
})

describe("Remote.mapMany", () => {
  const func = (str: string, num: number, bool: boolean) =>
    `${str}${num}${bool}`

  test("mapping with a NotAsked value", () => {
    expect(
      Remote.mapMany([Success("a"), NotAsked(), Success(true)], func)
    ).toEqual(NotAsked())
  })

  test("mapping with a Loading value", () => {
    expect(
      Remote.mapMany([Success("a"), Loading(), Success(true)], func)
    ).toEqual(Loading())
  })

  test("mapping with a Failure value", () => {
    expect(
      Remote.mapMany([Success("a"), Failure("error"), Success(true)], func)
    ).toEqual(Failure("error"))
  })

  test("mapping only Success values", () => {
    expect(
      Remote.mapMany([Success("a"), Success(1), Success(true)], func)
    ).toEqual(Success("a1true"))
  })
})

describe("Remote.ap", () => {
  test("applying a NotAsked value", () => {
    expect(Remote.ap(Success(5), NotAsked())).toEqual(NotAsked())
  })

  test("applying a Loading value", () => {
    expect(Remote.ap(Success(5), Loading())).toEqual(Loading())
  })

  test("applying a Failure value", () => {
    expect(Remote.ap(Success(5), Failure("error"))).toEqual(Failure("error"))
  })

  test("applying a Success value", () => {
    expect(Remote.ap(Success(5), Success((num: number) => num + 5))).toEqual(
      Success(10)
    )
  })
})

describe("Remote.sequence", () => {
  test("sequence over a list of Success values", () => {
    expect(Remote.sequence([Success(5), Success(4), Success(3)])).toEqual(
      Success([5, 4, 3])
    )
  })

  test("sequence over a list with a Failure value", () => {
    expect(Remote.sequence([Success(5), Failure("error"), Success(3)])).toEqual(
      Failure("error")
    )
  })

  test("sequence over a list with a NotAsked values", () => {
    expect(Remote.sequence([Success(5), NotAsked(), Success(3)])).toEqual(
      NotAsked()
    )
  })

  test("sequence over a list with a Loading values", () => {
    expect(Remote.sequence([Success(5), Loading(), Success(3)])).toEqual(
      Loading()
    )
  })
})
