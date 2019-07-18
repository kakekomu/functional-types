// Result type constructors

export type Result<err, val> = IErr<err> | IOk<val>

/** Type representing a remote data. No request is made to fetch remote data. */
export interface INotAsked {
  type: "NotAsked"
}

/** Type representing a remote data. Request to fetch failed. */
export interface IErr<err> {
  type: "Err"
  error: err
}

/** Result constructor function. Request to fetch failed. */
export const Err = <err, val>(error: err): Result<err, val> => ({
  type: "Err",
  error
})

/** Type representing a remote data. Request to fetch succeeded. */
export interface IOk<val> {
  type: "Ok"
  value: val
}

/** Result constructor function. Request to fetch succeeded. */
export const Ok = <err, val>(value: val): Result<err, val> => ({
  type: "Ok",
  value
})

/** Type representing a remote data in a Promise. */
export type AsyncResult<err, val> = Promise<Result<err, val>>

export type UnResult<T> = T extends { type: "Ok"; value: infer V } ? V : never

export type ResultList<err, T> = { [K in keyof T]: Result<err, T[K]> }

/** Map a function f over a Result value.
 *  If and only if the Result value is a success, this function will
 *  return a new Result with its wrapped value applied to f.
 *  Otherwise it returns the original Result value.
 *
 *  Result err a -> (a -> b) -> Result err b
 */
export const map = <err, val, returnVal>(
  remoteData: Result<err, val>,
  f: (value: val) => returnVal
): Result<err, returnVal> =>
  remoteData.type === "Ok" ? Ok(f(remoteData.value)) : remoteData

type GetErrorType<T> = T extends ResultList<infer err, any[]> ? err : never

type GetValueType<T> = T extends ResultList<any, infer vals> ? vals : never

/** Map a function f over a tuple of Result values.
 *  If and only if all the Result values are successes, this function will
 *  return a new Result with its wrapped value applied to f.
 *  Otherwise it returns the original Result value.
 *
 *  t (Result err a) -> (t a -> b) -> Result err b
 */
export const mapMany = <remoteVals extends any[], returnVal>(
  remoteArgs: remoteVals,
  f: (...args: GetValueType<remoteVals>) => returnVal
): Result<GetErrorType<remoteVals>, returnVal> =>
  // @ts-ignore
  map(sequence(remoteArgs), args => f(...args))

/** Map a function f over a Result error.
 *  If and only if the Result value is a failure, this function will
 *  return a new Result with its wrapped error applied to f.
 *  Otherwise it returns the original Result.
 *
 *  Result err a -> (err -> errB) -> Result errB a
 */
export const mapErr = <err, val, newerr>(
  remoteData: Result<err, val>,
  f: (error: err) => newerr
): Result<newerr, val> =>
  remoteData.type === "Err" ? Err(f(remoteData.error)) : remoteData

/** Map two functions fErr and fVal for Err and Ok cases respectively.
 *  Same as remote.mapErr(remote.map(remoteData, fVal), fErr)
 *
 *  Result err val -> (err -> errB) -> (val -> valB) -> Result errB valB
 */
export const mapBoth = <err, val, newerr, newval>(
  remoteData: Result<err, val>,
  fErr: (error: err) => newerr,
  fVal: (value: val) => newval
): Result<newerr, newval> =>
  remoteData.type === "Err"
    ? Err(fErr(remoteData.error))
    : remoteData.type === "Ok"
    ? Ok(fVal(remoteData.value))
    : remoteData

/** List (Result err a) -> Result err (List a) */
export const sequence = <err, val>(
  remoteDataList: Array<Result<err, val>>
): Result<err, val[]> =>
  remoteDataList.reduce(
    (prev, current) =>
      prev.type === "Ok" && current.type === "Ok"
        ? Ok([...prev.value, current.value])
        : prev.type === "Ok" && current.type !== "Ok"
        ? current
        : prev,
    Ok([])
  )

/** List a -> (a -> Result err a) -> Result err (List a) */
export const traverse = <err, val>(
  valueList: val[],
  f: (value: val) => Result<err, val>
) =>
  valueList.reduce((prev, current) => {
    const applied = f(current)
    return prev.type === "Ok" && applied.type === "Ok"
      ? Ok([...prev.value, applied.value])
      : prev.type === "Ok" && applied.type !== "Ok"
      ? current
      : prev
  }, Ok([]))

/** Also known as bind or flatMap. It is a good way to chain dependent actions.
 *  If and only if the input value is a success, this function will
 *  apply its wrapped value to f.
 *  Otherwise it returns the original Result.
 *
 *  Result err a -> (a -> Result err b) -> Result err b
 */
export const andThen = <err, val, returnVal>(
  remoteData: Result<err, val>,
  f: (value: val) => Result<err, returnVal>
): Result<err, returnVal> =>
  remoteData.type === "Ok" ? f(remoteData.value) : remoteData

/** Also known as apply. Same as map, but the function that operates on the
 *  value is also wrapped in a Result.
 *  If and only if both Result values are successes, this function will
 *  return the wrapped value applied to f.
 *  Otherwise it returns the original Result value.
 *
 *  Result err a -> Result err (a -> b) -> Result err b
 */
export const ap = <err, val, returnVal>(
  remoteData: Result<err, val>,
  applicativeF: Result<err, (value: val) => returnVal>
): Result<err, returnVal> =>
  applicativeF.type === "Ok"
    ? map(remoteData, applicativeF.value)
    : applicativeF

/** Unwraps a Result value to a primitive value with a default.
 *  If and only if the Result is a value this function will return its
 *  wrapped value. Otherwise it will return the default value.
 *
 *  Result err a -> a -> a
 */
export const withDefault = <err, val>(
  remoteData: Result<err, val>,
  defaultValue: val
): val => (remoteData.type === "Ok" ? remoteData.value : defaultValue)

/** Creates a Result value from nullable primitive value.
 *  It will return a Err if the input value is null or undefined.
 *
 *  a? -> err -> Result err a
 */
export const fromNullable = <err, val>(
  testedValue: val | undefined | null,
  errorMessage: err
): Result<err, val> =>
  testedValue !== null &&
  testedValue !== undefined &&
  (typeof testedValue !== "number" || !isNaN(testedValue))
    ? Ok(testedValue)
    : Err(errorMessage)

/** Creates a Result value based on the return of a TypeScript guard.
 *  It will return a Err if the input value is null or undefined.
 *
 *  unknown -> err -> (unknown -> boolean) -> Result err a
 */
export const fromGuarded = <err, val>(
  testedValue: unknown,
  errorMessage: err,
  validator: (testedValue: unknown) => testedValue is val
) => (validator(testedValue) ? Ok(testedValue) : Err(errorMessage))

/** Helper function to determine if a Result is a success */
export const isOk = <err, val>(remoteData: Result<err, val>) =>
  remoteData.type === "Ok"

/** Helper function to determine if a Result is a failure */
export const isErr = <err, val>(remoteData: Result<err, val>) =>
  remoteData.type === "Err"
