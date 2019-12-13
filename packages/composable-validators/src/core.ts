import { Result, Ok, Err, isOk, isErr } from "@kakekomu/result-type"

type Validated<T> = Result<string[], T>

/** Validator is simply a function that returns a Result type
 *  Some validators will change the type of the value type. For example
 *  an isString validator takes an `any` and returns a `Validated<string>`
 */
type Validator<A, B extends A = A> = (value: A) => Validated<B>

const mergeErrors = (
  validated1: Validated<any>,
  validated2: Validated<any>
): Validated<any> => {
  const errors1 = isErr(validated1) ? validated1.error : []
  const errors2 = isErr(validated2) ? validated2.error : []

  return Err([...errors1, ...errors2])
}

/** Merges two validated values.
 * If both validated values are Ok, the first validatee will be returned.
 * If one or both of them fails, all the errors will be returned.
 */
const prev = <T>(
  validated1: Validated<T>,
  validated2: Validated<any>
): Validated<T> => {
  if (isOk(validated1) && isOk(validated2)) {
    return validated1
  } else {
    return mergeErrors(validated1, validated2)
  }
}

/** Merges two validated values.
 * If both validated values are Ok, the second validatee will be returned.
 * If one or both of them fails, all the errors will be returned.
 */
const next = <T>(
  validated1: Validated<any>,
  validated2: Validated<T>
): Validated<T> => {
  if (isOk(validated1) && isOk(validated2)) {
    return validated2
  } else {
    return mergeErrors(validated1, validated2)
  }
}

/** Validates an unknown type using a TS guard funcion */
const customGuarded = <A, B extends A = A>(
  predicate: (value: A) => value is B,
  errorMsg: string
): Validator<A, B> => value => (predicate(value) ? Ok(value) : Err([errorMsg]))

/** Validates a value using a predicate funcion */
const custom = <T>(
  predicate: (value: T) => boolean,
  errorMsg: string
): Validator<T> => value => (predicate(value) ? Ok(value) : Err([errorMsg]))

/** Compose two validators to one */
const compose = <T>(
  validator1: Validator<T>,
  validator2: Validator<T>
): Validator<T> => value => {
  const validated1 = validator1(value)
  const validated2 = validator2(value)

  if (isOk(validated1) && isOk(validated2)) {
    return Ok(value)
  }
  return mergeErrors(validated1, validated2)
}

/** Compose a list of validators to one new validator */
const many = <T>(validators: Validator<T>[]): Validator<T> =>
  validators.reduce(compose)

/** Flips the result of a validator */
const not = <T>(
  errorMsg: string,
  validator: Validator<T>
): Validator<T> => value =>
  isOk(validator(value)) ? Err([errorMsg]) : Ok(value)

export {
  Validator,
  Validated,
  compose,
  many,
  prev,
  next,
  custom,
  customGuarded,
  not
}
