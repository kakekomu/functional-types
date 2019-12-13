import { Validator, custom, customGuarded } from "./core"

/** Creates a validator that checks if the value is a number */
const isNumber = (errorMsg: string): Validator<unknown, number> => {
  const predicate = (value: unknown): value is number =>
    typeof value === "number"

  return customGuarded(predicate, errorMsg)
}

/** Creates a validator that checks if the value is greater than or equal to a given number */
const min = (errorMsg: string, minChars: number): Validator<number> =>
  custom(value => value >= minChars, errorMsg)

/** Creates a validator that checks if the value is less than or equal to a given number */
const max = (errorMsg: string, maxChars: number): Validator<number> =>
  custom(value => value <= maxChars, errorMsg)

export { isNumber, min, max }
