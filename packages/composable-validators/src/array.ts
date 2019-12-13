import { Ok, Err } from "@kakekomu/result-type"
import { Validator, prev } from "./core"

/** Creates a validator that checks if the array is exactly as long as a given number */
const length = <T>(errorMsg: string, amount: number): Validator<T[]> => array =>
  array.length === amount ? Ok(array) : Err([errorMsg])

/** Creates a validator that checks all the values in the array with a given validator */
const every = <T>(validator: Validator<T>): Validator<T[]> => array => {
  return array.reduce(
    (prevValidated, currentValue) =>
      prev(prevValidated, validator(currentValue)),
    Ok<string[], T[]>(array)
  )
}

/** Creates a validator that checks all the values in the array with a given list of validators */
const each = <T>(
  errorMsg: string,
  validators: Validator<T>[]
): Validator<T[]> => array =>
  array
    .filter((_, index) => validators[index])
    .map((value, index) => validators[index](value))
    .reduce(prev, length<T>(errorMsg, validators.length)(array))

export { length, every, each }
