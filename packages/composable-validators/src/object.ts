import { Result, Ok, Err } from "@kakekomu/result-type"
import { Validator, prev } from "./core"

type Schema<T> = { [K in keyof T]: Validator<T[K]> }

/** Creates a validator that checks the properties of an object based on a schema */
const schema = <T extends Record<string | number, any>>(
  errorMsg: string,
  schema: Schema<T>
): Validator<T> => obj => {
  const keys = Object.keys(schema) as Array<keyof T>

  return keys.reduce((prevObj: Result<string[], T>, key) => {
    if (obj[key]) {
      const propertyValidator = schema[key]
      const validated = prev(prevObj, propertyValidator(obj[key]))
      return validated
    } else {
      return Err([errorMsg])
    }
  }, Ok<string[], T>(obj))
}

export { schema }
