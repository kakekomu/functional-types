// Result type constructors

export type Result<err, val> = Err<err> | Ok<val>

/** Type representing a failure with an error message. */
export interface Err<err> {
  readonly type: "Err"
  readonly error: err
}

/** Result constructor function. */
export const Err = <err, val>(error: err): Result<err, val> => ({
  type: "Err",
  error
})

/** Type representing a success. */
export interface Ok<val> {
  readonly type: "Ok"
  readonly value: val
}

/** Result constructor function. */
export const Ok = <err, val>(value: val): Result<err, val> => ({
  type: "Ok",
  value
})

/** Type representing a result data in a Promise. */
export type AsyncResult<err, val> = Promise<Result<err, val>>

export type UnResult<T> = T extends { type: "Ok"; value: infer V } ? V : never

export type ResultList<err, T> = { [K in keyof T]: Result<err, T[K]> }

/** Join a nested Result
 *
 *  Result err (Result err a) -> Result err a
 */
export const join = <err, val>(
  result: Result<err, Result<err, val>>
): Result<err, val> => (result.type === "Ok" ? result.value : result)

/** Map a function f over a Result value.
 *  If and only if the Result value is a success, this function will
 *  return a new Result with its wrapped value applied to f.
 *  Otherwise it returns the original Result value.
 *
 *  Result err a -> (a -> b) -> Result err b
 */
export const map = <err, val, returnVal>(
  result: Result<err, val>,
  f: (value: val) => returnVal
): Result<err, returnVal> =>
  result.type === "Ok" ? Ok(f(result.value)) : result

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
  result: Result<err, val>,
  f: (error: err) => newerr
): Result<newerr, val> =>
  result.type === "Err" ? Err(f(result.error)) : result

/** Map two functions fErr and fVal for Err and Ok cases respectively.
 *  Same as result.mapErr(result.map(result, fVal), fErr)
 *
 *  Result err val -> (err -> errB) -> (val -> valB) -> Result errB valB
 */
export const mapBoth = <err, val, newerr, newval>(
  result: Result<err, val>,
  fErr: (error: err) => newerr,
  fVal: (value: val) => newval
): Result<newerr, newval> =>
  result.type === "Err"
    ? Err(fErr(result.error))
    : result.type === "Ok"
    ? Ok(fVal(result.value))
    : result

/** List (Result err a) -> Result err (List a) */
export function sequence<err, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  resultList: ResultList<err, [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>
): Result<err, [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>
export function sequence<err, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  resultList: ResultList<err, [T1, T2, T3, T4, T5, T6, T7, T8, T9]>
): Result<err, [T1, T2, T3, T4, T5, T6, T7, T8, T9]>
export function sequence<err, T1, T2, T3, T4, T5, T6, T7, T8>(
  resultList: ResultList<err, [T1, T2, T3, T4, T5, T6, T7, T8]>
): Result<err, [T1, T2, T3, T4, T5, T6, T7, T8]>
export function sequence<err, T1, T2, T3, T4, T5, T6, T7>(
  resultList: ResultList<err, [T1, T2, T3, T4, T5, T6, T7]>
): Result<err, [T1, T2, T3, T4, T5, T6, T7]>
export function sequence<err, T1, T2, T3, T4, T5, T6>(
  resultList: ResultList<err, [T1, T2, T3, T4, T5, T6]>
): Result<err, [T1, T2, T3, T4, T5, T6]>
export function sequence<err, T1, T2, T3, T4, T5>(
  resultList: ResultList<err, [T1, T2, T3, T4, T5]>
): Result<err, [T1, T2, T3, T4, T5]>
export function sequence<err, T1, T2, T3, T4>(
  resultList: ResultList<err, [T1, T2, T3, T4]>
): Result<err, [T1, T2, T3, T4]>
export function sequence<err, T1, T2, T3>(
  resultList: ResultList<err, [T1, T2, T3]>
): Result<err, [T1, T2, T3]>
export function sequence<err, T1, T2>(
  resultList: ResultList<err, [T1, T2]>
): Result<err, [T1, T2]>
export function sequence<err, T>(
  resultList: Array<Result<err, T>>
): Result<err, T[]>
export function sequence<err, T>(
  resultList: Array<Result<err, T>>
): Result<err, T[]> {
  return resultList.reduce(
    (prev, current) =>
      prev.type === "Ok" && current.type === "Ok"
        ? Ok([...prev.value, current.value])
        : prev.type === "Ok" && current.type !== "Ok"
        ? current
        : prev,
    Ok([])
  )
}

/** Take all the values that are present, throwing away any errors.
 *
 *  List (Result err a) -> List a
 */
export const values = <err, val>(resultList: Array<Result<err, val>>): val[] =>
  resultList.reduce((acc, resp) => {
    if (isOk(resp)) {
      return [...acc, resp.value]
    } else {
      return acc
    }
  }, [] as val[])

/** List a -> (a -> Result err a) -> Result err (List a) */
export const traverse = <err, val, returnVal>(
  valueList: val[],
  f: (value: val) => Result<err, returnVal>
): Result<err, returnVal[]> => sequence(valueList.map(value => f(value)))

/** Also known as bind or flatMap. It is a good way to chain dependent actions.
 *  If and only if the input value is a success, this function will
 *  apply its wrapped value to f.
 *  Otherwise it returns the original Result.
 *
 *  Result err a -> (a -> Result err b) -> Result err b
 */
export const andThen = <err, val, returnVal>(
  result: Result<err, val>,
  f: (value: val) => Result<err, returnVal>
): Result<err, returnVal> => (result.type === "Ok" ? f(result.value) : result)

/** Also known as apply. Same as map, but the function that operates on the
 *  value is also wrapped in a Result.
 *  If and only if both Result values are successes, this function will
 *  return the wrapped value applied to f.
 *  Otherwise it returns the original Result value.
 *
 *  Result err a -> Result err (a -> b) -> Result err b
 */
export const ap = <err, val, returnVal>(
  result: Result<err, val>,
  applicativeF: Result<err, (value: val) => returnVal>
): Result<err, returnVal> =>
  applicativeF.type === "Ok" ? map(result, applicativeF.value) : applicativeF

/** Unwraps a Result value to a primitive value with a default.
 *  If and only if the Result is a value this function will return its
 *  wrapped value. Otherwise it will return the default value.
 *
 *  Result err a -> a -> a
 */
export const withDefault = <err, val>(
  result: Result<err, val>,
  defaultValue: val
): val => (result.type === "Ok" ? result.value : defaultValue)

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
): Result<err, val> =>
  validator(testedValue) ? Ok(testedValue) : Err(errorMessage)

/** Helper function to determine if a Result is a success */
export const isOk = <err, val>(result: Result<err, val>): result is Ok<val> =>
  result.type === "Ok"

/** Helper function to determine if a Result is a failure */
export const isErr = <err, val>(result: Result<err, val>): result is Err<err> =>
  result.type === "Err"

// ASYNC HELPERS

/** The same as result.map but with an AsyncResult value
 *
 *  AsyncResult err a -> (a -> b) -> AsyncResult err b
 */
export const mapAsync = <err, val, returnVal>(
  asyncResult: AsyncResult<err, val>,
  f: (value: val) => returnVal
): AsyncResult<err, returnVal> => asyncResult.then(result => map(result, f))

/** The same as result.map but with an async function
 *
 *  Result err a -> (a -> Promise b) -> AsyncResult err b
 */
export const mapAsyncF = <err, val, returnVal>(
  result: Result<err, val>,
  f: (value: val) => Promise<returnVal>
): AsyncResult<err, returnVal> =>
  result.type === "Ok"
    ? f(result.value).then(asyncResult => Ok(asyncResult))
    : new Promise(resolve => resolve(result))

/** The same as result.mapFailure but with an AsyncResult value
 *
 *  AsyncResult err a -> (err -> errB) -> AsyncResult errB a
 */
export const mapErrAsync = <err, val, newerr>(
  asyncResult: AsyncResult<err, val>,
  f: (error: err) => newerr
): AsyncResult<newerr, val> => asyncResult.then(result => mapErr(result, f))

/** The same as result.mapBoth but with an AsyncResult value
 *
 *  AsyncResult err val -> (err -> errB) -> (val -> valB) -> AsyncResult errB valB
 */
export const mapBothAsync = <err, val, newerr, newval>(
  asyncResult: AsyncResult<err, val>,
  fErr: (error: err) => newerr,
  fVal: (value: val) => newval
): AsyncResult<newerr, newval> =>
  asyncResult.then(result => mapBoth(result, fErr, fVal))

/** List (AsyncResult err a) -> AsyncResult err (List a) */
export const sequenceAsync = <err, val>(
  asyncResultList: Array<AsyncResult<err, val>>
): AsyncResult<err, val[]> =>
  Promise.all(asyncResultList).then(resultList => sequence(resultList))

/** The same as result.andThen but with an AsyncResult value
 *
 *  AsyncResult err a -> (a -> AsyncResult err b) -> AsyncResult err b
 */
export const andThenAsync = <err, val, returnVal>(
  asyncResult: AsyncResult<err, val>,
  f: (value: val) => Result<err, returnVal>
): AsyncResult<err, returnVal> => asyncResult.then(result => andThen(result, f))

/** The same as result.andThen but with an async function
 *
 *  AsyncResult err a -> (a -> AsyncResult err b) -> AsyncResult err b
 */
export const andThenAsyncF = <err, val, returnVal>(
  result: Result<err, val>,
  f: (value: val) => AsyncResult<err, returnVal>
): AsyncResult<err, returnVal> =>
  result.type === "Ok"
    ? f(result.value)
    : new Promise(resolve => resolve(result))

/** The same as result.andThen but with an async function
 *
 *  AsyncResult err a -> (a -> AsyncResult err b) -> AsyncResult err b
 */
export const andThenAsyncRF = <err, val, returnVal>(
  asyncResult: AsyncResult<err, val>,
  f: (value: val) => AsyncResult<err, returnVal>
): AsyncResult<err, returnVal> =>
  asyncResult.then(result =>
    result.type === "Ok"
      ? f(result.value)
      : new Promise(resolve => resolve(result))
  )

/** The same as result.ap but with an AsyncResult value
 *
 *  AsyncResult err a -> AsyncResult err (a -> b) -> AsyncResult err b
 */
export const apAsync = <err, val, returnVal>(
  asyncResult: AsyncResult<err, val>,
  asyncApplicativeF: AsyncResult<err, (value: val) => returnVal>
): AsyncResult<err, returnVal> =>
  Promise.all([asyncResult, asyncApplicativeF]).then(([result, applicativeF]) =>
    ap(result, applicativeF)
  )

/** List a -> (a -> AsynResult err a) -> AsyncResult err (List a) */
export const traverseAsyncF = <err, val, returnVal>(
  valueList: val[],
  f: (value: val) => AsyncResult<err, returnVal>
): AsyncResult<err, returnVal[]> =>
  sequenceAsync(valueList.map(value => f(value)))

/** The same as result.map but with an async function
 *
 *  t (Result err a) -> (t a -> Promise b) -> AsyncResult err b
 */
export const mapManyAsyncF = <remoteVals extends any[], returnVal>(
  remoteArgs: remoteVals,
  f: (...args: GetValueType<remoteVals>) => Promise<returnVal>
): AsyncResult<GetErrorType<remoteVals>, returnVal> =>
  // @ts-ignore
  mapAsyncF(sequence(remoteArgs), args => f(...args))
