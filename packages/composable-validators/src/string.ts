import * as result from "@kakekomu/result-type"
import { Validator, custom, customGuarded } from "./core"
import * as array from "./array"

/*
 * Basic validators
 */

/** Creates a validator that checks if the value matches a given regular expression */
const regex = (errorMsg: string, regexp: string | RegExp): Validator<string> =>
  typeof regexp === "string"
    ? custom(value => new RegExp(regexp).test(value), errorMsg)
    : custom(value => regexp.test(value), errorMsg)

/** Creates a validator that checks if the value is a string */
const isString = (errorMsg: string): Validator<unknown, string> =>
  customGuarded(
    (value: unknown): value is string => typeof value === "string",
    errorMsg
  )

/** Creates a validator that checks if the value is longer or equal than a given number */
const min = (errorMsg: string, minChars: number): Validator<string> =>
  custom(value => value.length >= minChars, errorMsg)

/** Creates a validator that checks if the value is shorter or equal than a given number */
const max = (errorMsg: string, maxChars: number): Validator<string> =>
  custom(value => value.length <= maxChars, errorMsg)

/** Creates a validator that checks if the value is exactly as long as a given number */
const length = (errorMsg: string, minChars: number): Validator<string> =>
  custom(value => value.length === minChars, errorMsg)

/*
 * Regex based validators
 */

/** Creates a validator that checks if the value has a lower case letter.
 *  Optionally the minimum number of matches can be specified.
 */
const hasLowcase = (errorMsg: string, atLeast = 1): Validator<string> =>
  regex(errorMsg, `([a-z].*){${atLeast}}`)

/** Creates a validator that check if the value only consists of lower case letters */
const onlyLowcases = (errorMsg: string): Validator<string> =>
  regex(errorMsg, /^[a-z]*$/)

/** Creates a validator that checks if the value has a upper case letter.
 *  Optionally the minimum number of matches can be specified.
 */
const hasUpcase = (errorMsg: string, atLeast = 1): Validator<string> =>
  regex(errorMsg, `([A-Z].*){${atLeast}}`)

/** Creates a validator that checks if the value only consists of upper case letters */
const onlyUpcases = (errorMsg: string): Validator<string> =>
  regex(errorMsg, /^[A-Z]*$/)

/** Creates a validator that checks if the value has a number.
 *  Optionally the minimum number of matches can be specified.
 */
const hasNumber = (errorMsg: string, atLeast = 1): Validator<string> =>
  regex(errorMsg, `([0-9].*){${atLeast}}`)

/** Creates a validator that checks if the value only consists of numbers */
const onlyNumbers = (errorMsg: string): Validator<string> =>
  regex(errorMsg, /^[0-9]*$/)

/** Creates a validator that checks if the value is a valid e-mail address */
const isEmail = (errorMsg: string): Validator<string> =>
  regex(
    errorMsg,
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )

/** Creates a validator that checks a string sequence separated by a given symbol
 *  The parts of the sequence are validated by a list of validators
 */
const separated = (
  errorMsg: string,
  separator: string,
  validators: Validator<string>[]
): Validator<string> => value => {
  const blocks = value.split(separator)
  const validated = array.each(errorMsg, validators)(blocks)

  return result.map(validated, validBlocks => validBlocks.join(separator))
}

export {
  isString,
  min,
  max,
  length,
  regex,
  hasLowcase,
  onlyLowcases,
  hasUpcase,
  onlyUpcases,
  hasNumber,
  onlyNumbers,
  isEmail,
  separated
}
