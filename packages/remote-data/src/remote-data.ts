import * as result from "@kakekomu/result-type"
// RemoteData type constructors

export type RemoteData<err, val> =
  | INotAsked
  | ILoading
  | IFailure<err>
  | ISuccess<val>

/** Type representing a remote data. No request is made to fetch remote data. */
export interface INotAsked {
  readonly type: "NotAsked"
}

/** RemoteData constructor function. No request is made to fetch remote data. */
export const NotAsked = <err, val>(): RemoteData<err, val> => ({
  type: "NotAsked"
})

/** Type representing a remote data. Request is made to fetch remote data. */
export interface ILoading {
  readonly type: "Loading"
}

/** RemoteData constructor function. Request is made to fetch remote data. */
export const Loading = <err, val>(): RemoteData<err, val> => ({
  type: "Loading"
})

/** Type representing a remote data. Request to fetch failed. */
export interface IFailure<err> {
  readonly type: "Failure"
  readonly error: err
}

/** RemoteData constructor function. Request to fetch failed. */
export const Failure = <err, val>(error: err): RemoteData<err, val> => ({
  type: "Failure",
  error
})

/** Type representing a remote data. Request to fetch succeeded. */
export interface ISuccess<val> {
  readonly type: "Success"
  readonly value: val
}

/** RemoteData constructor function. Request to fetch succeeded. */
export const Success = <err, val>(value: val): RemoteData<err, val> => ({
  type: "Success",
  value
})

/** Type representing a remote data in a Promise. */
export type AsyncRemoteData<err, val> = Promise<RemoteData<err, val>>

export type UnRemoteData<T> = T extends { type: "Success"; value: infer V }
  ? V
  : never

export type RemoteDataList<err, T> = { [K in keyof T]: RemoteData<err, T[K]> }

/** Map a function f over a RemoteData value.
 *  If and only if the RemoteData value is a success, this function will
 *  return a new RemoteData with its wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  RemoteData err a -> (a -> b) -> RemoteData err b
 */
export const map = <err, val, returnVal>(
  remoteData: RemoteData<err, val>,
  f: (value: val) => returnVal
): RemoteData<err, returnVal> =>
  remoteData.type === "Success" ? Success(f(remoteData.value)) : remoteData

type GetErrorType<T> = T extends RemoteDataList<infer err, any[]> ? err : never

type GetValueType<T> = T extends RemoteDataList<any, infer vals> ? vals : never

/** Map a function f over a tuple of RemoteData values.
 *  If and only if all the RemoteData values are successes, this function will
 *  return a new RemoteData with its wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  t (RemoteData err a) -> (t a -> b) -> RemoteData err b
 */
export const mapMany = <remoteVals extends any[], returnVal>(
  remoteArgs: remoteVals,
  f: (...args: GetValueType<remoteVals>) => returnVal
): RemoteData<GetErrorType<remoteVals>, returnVal> =>
  // @ts-ignore
  map(sequence(remoteArgs), args => f(...args))

/** Map a function f over a RemoteData error.
 *  If and only if the RemoteData value is a failure, this function will
 *  return a new RemoteData with its wrapped error applied to f.
 *  Otherwise it returns the original RemoteData.
 *
 *  RemoteData err a -> (err -> errB) -> RemoteData errB a
 */
export const mapFailure = <err, val, newerr>(
  remoteData: RemoteData<err, val>,
  f: (error: err) => newerr
): RemoteData<newerr, val> =>
  remoteData.type === "Failure" ? Failure(f(remoteData.error)) : remoteData

/** Map two functions fErr and fVal for Failure and Success cases respectively.
 *  Same as remote.mapFailure(remote.map(remoteData, fVal), fErr)
 *
 *  RemoteData err val -> (err -> errB) -> (val -> valB) -> RemoteData errB valB
 */
export const mapBoth = <err, val, newerr, newval>(
  remoteData: RemoteData<err, val>,
  fErr: (error: err) => newerr,
  fVal: (value: val) => newval
): RemoteData<newerr, newval> =>
  remoteData.type === "Failure"
    ? Failure(fErr(remoteData.error))
    : remoteData.type === "Success"
    ? Success(fVal(remoteData.value))
    : remoteData

/** List (RemoteData err a) -> RemoteData err (List a) */
export function sequence<err, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  resultList: RemoteDataList<err, [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>
): RemoteData<err, [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>
export function sequence<err, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  resultList: RemoteDataList<err, [T1, T2, T3, T4, T5, T6, T7, T8, T9]>
): RemoteData<err, [T1, T2, T3, T4, T5, T6, T7, T8, T9]>
export function sequence<err, T1, T2, T3, T4, T5, T6, T7, T8>(
  resultList: RemoteDataList<err, [T1, T2, T3, T4, T5, T6, T7, T8]>
): RemoteData<err, [T1, T2, T3, T4, T5, T6, T7, T8]>
export function sequence<err, T1, T2, T3, T4, T5, T6, T7>(
  resultList: RemoteDataList<err, [T1, T2, T3, T4, T5, T6, T7]>
): RemoteData<err, [T1, T2, T3, T4, T5, T6, T7]>
export function sequence<err, T1, T2, T3, T4, T5, T6>(
  resultList: RemoteDataList<err, [T1, T2, T3, T4, T5, T6]>
): RemoteData<err, [T1, T2, T3, T4, T5, T6]>
export function sequence<err, T1, T2, T3, T4, T5>(
  resultList: RemoteDataList<err, [T1, T2, T3, T4, T5]>
): RemoteData<err, [T1, T2, T3, T4, T5]>
export function sequence<err, T1, T2, T3, T4>(
  resultList: RemoteDataList<err, [T1, T2, T3, T4]>
): RemoteData<err, [T1, T2, T3, T4]>
export function sequence<err, T1, T2, T3>(
  resultList: RemoteDataList<err, [T1, T2, T3]>
): RemoteData<err, [T1, T2, T3]>
export function sequence<err, T1, T2>(
  resultList: RemoteDataList<err, [T1, T2]>
): RemoteData<err, [T1, T2]>
export function sequence<err, T>(
  resultList: Array<RemoteData<err, T>>
): RemoteData<err, T[]>
export function sequence<err, T>(
  resultList: Array<RemoteData<err, T>>
): RemoteData<err, T[]> {
  return resultList.reduce(
    (prev, current) =>
      prev.type === "Success" && current.type === "Success"
        ? Success([...prev.value, current.value])
        : prev.type === "Success" && current.type !== "Success"
        ? current
        : prev,
    Success([])
  )
}

/** List a -> (a -> RemoteData err a) -> RemoteData err (List a) */
export const traverse = <err, val, returnVal>(
  valueList: val[],
  f: (value: val) => RemoteData<err, returnVal>
): RemoteData<err, returnVal[]> => sequence(valueList.map(value => f(value)))

/** Also known as bind or flatMap. It is a good way to chain dependent actions.
 *  If and only if the input value is a success, this function will
 *  apply its wrapped value to f.
 *  Otherwise it returns the original RemoteData.
 *
 *  RemoteData err a -> (a -> RemoteData err b) -> RemoteData err b
 */
export const andThen = <err, val, returnVal>(
  remoteData: RemoteData<err, val>,
  f: (value: val) => RemoteData<err, returnVal>
): RemoteData<err, returnVal> =>
  remoteData.type === "Success" ? f(remoteData.value) : remoteData

/** Also known as apply. Same as map, but the function that operates on the
 *  value is also wrapped in a RemoteData.
 *  If and only if both RemoteData values are successes, this function will
 *  return the wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  RemoteData err a -> RemoteData err (a -> b) -> RemoteData err b
 */
export const ap = <err, val, returnVal>(
  remoteData: RemoteData<err, val>,
  applicativeF: RemoteData<err, (value: val) => returnVal>
): RemoteData<err, returnVal> =>
  applicativeF.type === "Success"
    ? map(remoteData, applicativeF.value)
    : applicativeF

/** Unwraps a RemoteData value to a primitive value with a default.
 *  If and only if the RemoteData is a value this function will return its
 *  wrapped value. Otherwise it will return the default value.
 *
 *  RemoteData err a -> a -> a
 */
export const withDefault = <err, val>(
  remoteData: RemoteData<err, val>,
  defaultValue: val
): val => (remoteData.type === "Success" ? remoteData.value : defaultValue)

/** Creates a RemoteData value from nullable primitive value.
 *  It will return a Failure if the input value is null or undefined.
 *  Good for use with other libraries.
 *
 *  a? -> err -> RemoteData err a
 */
export const fromNullable = <err, val>(
  testedValue: val | undefined | null,
  errorMessage: err
): RemoteData<err, val> =>
  testedValue !== null &&
  testedValue !== undefined &&
  (typeof testedValue !== "number" || !isNaN(testedValue))
    ? Success(testedValue)
    : Failure(errorMessage)

/** Creates a RemoteData value based on the return of a TypeScript guard.
 *  It will return a Failure if the input value is null or undefined.
 *
 *  unknown -> err -> (unknown -> boolean) -> RemoteData err a
 */
export const fromGuarded = <err, val>(
  testedValue: unknown,
  errorMessage: err,
  validator: (testedValue: unknown) => testedValue is val
): RemoteData<err, val> =>
  validator(testedValue) ? Success(testedValue) : Failure(errorMessage)

/** Helper function to determine if a RemoteData is a success */
export const isNotAsked = <err, val>(
  remoteData: RemoteData<err, val>
): remoteData is INotAsked => remoteData.type === "NotAsked"

/** Helper function to determine if a RemoteData is a success */
export const isLoading = <err, val>(
  remoteData: RemoteData<err, val>
): remoteData is ILoading => remoteData.type === "Loading"

/** Helper function to determine if a RemoteData is a success */
export const isSuccess = <err, val>(
  remoteData: RemoteData<err, val>
): remoteData is ISuccess<val> => remoteData.type === "Success"

/** Helper function to determine if a RemoteData is a failure */
export const isFailure = <err, val>(
  remoteData: RemoteData<err, val>
): remoteData is IFailure<err> => remoteData.type === "Failure"

/** Converts a RemoteData type to a Result type with a default error value
 *
 *  RemoteData err a -> err -> Result err a
 */
export const toResult = <err, val>(
  remoteData: RemoteData<err, val>,
  defaultError: err
): result.Result<err, val> =>
  remoteData.type === "Success"
    ? result.Ok(remoteData.value)
    : remoteData.type === "Failure"
    ? result.Err(remoteData.error)
    : result.Err(defaultError)

/** Converts a Result type to a RemoteData with a default error value
 *
 *  RemoteData err a -> err -> Result err a
 */
export const fromResult = <err, val>(
  resultData: result.Result<err, val>
): RemoteData<err, val> =>
  resultData.type === "Ok"
    ? Success(resultData.value)
    : Failure(resultData.error)

// ASYNC HELPERS

/** The same as remote.map but with an AsyncRemoteData value
 *
 *  AsyncRemoteData err a -> (a -> b) -> AsyncRemoteData err b
 */
export const mapAsync = <err, val, returnVal>(
  asyncRemoteData: AsyncRemoteData<err, val>,
  f: (value: val) => returnVal
): AsyncRemoteData<err, returnVal> =>
  asyncRemoteData.then(remoteData => map(remoteData, f))

/** The same as remote.map but with an async function
 *
 *  Result err a -> (a -> Promise b) -> AsyncResult err b
 */
export const mapAsyncF = <err, val, returnVal>(
  remote: RemoteData<err, val>,
  f: (value: val) => Promise<returnVal>
): AsyncRemoteData<err, returnVal> =>
  remote.type === "Success"
    ? f(remote.value).then(asyncResult => Success(asyncResult))
    : new Promise(resolve => resolve(remote))

/** The same as remote.mapFailure but with an AsyncRemoteData value
 *
 *  AsyncRemoteData err a -> (err -> errB) -> AsyncRemoteData errB a
 */
export const mapFailureAsync = <err, val, newerr>(
  asyncRemoteData: AsyncRemoteData<err, val>,
  f: (error: err) => newerr
): AsyncRemoteData<newerr, val> =>
  asyncRemoteData.then(remoteData => mapFailure(remoteData, f))

/** The same as remote.mapBoth but with an AsyncRemoteData value
 *
 *  AsyncRemoteData err val -> (err -> errB) -> (val -> valB) -> AsyncRemoteData errB valB
 */
export const mapBothAsync = <err, val, newerr, newval>(
  asyncRemoteData: AsyncRemoteData<err, val>,
  fErr: (error: err) => newerr,
  fVal: (value: val) => newval
): AsyncRemoteData<newerr, newval> =>
  asyncRemoteData.then(remoteData => mapBoth(remoteData, fErr, fVal))

/** List (AsyncRemoteData err a) -> AsyncRemoteData err (List a) */
export const sequenceAsync = <err, val>(
  asyncRemoteDataList: Array<AsyncRemoteData<err, val>>
): AsyncRemoteData<err, val[]> =>
  Promise.all(asyncRemoteDataList).then(remoteDataList =>
    sequence(remoteDataList)
  )

/** The same as remote.andThen but with an AsyncRemoteData value
 *
 *  AsyncRemoteData err a -> (a -> AsyncRemoteData err b) -> AsyncRemoteData err b
 */
export const andThenAsync = <err, val, returnVal>(
  asyncRemoteData: AsyncRemoteData<err, val>,
  f: (value: val) => RemoteData<err, returnVal>
): AsyncRemoteData<err, returnVal> =>
  asyncRemoteData.then(remoteData => andThen(remoteData, f))

/** The same as result.andThen but with an async function
 *
 *  AsyncResult err a -> (a -> AsyncResult err b) -> AsyncResult err b
 */
export const andThenAsyncF = <err, val, returnVal>(
  remote: RemoteData<err, val>,
  f: (value: val) => AsyncRemoteData<err, returnVal>
): AsyncRemoteData<err, returnVal> =>
  remote.type === "Success"
    ? f(remote.value)
    : new Promise(resolve => resolve(remote))

/** The same as remote.ap but with an AsyncRemoteData value
 *
 *  AsyncRemoteData err a -> AsyncRemoteData err (a -> b) -> AsyncRemoteData err b
 */
export const apAsync = <err, val, returnVal>(
  asyncRemoteData: AsyncRemoteData<err, val>,
  asyncApplicativeF: AsyncRemoteData<err, (value: val) => returnVal>
): AsyncRemoteData<err, returnVal> =>
  Promise.all([asyncRemoteData, asyncApplicativeF]).then(
    ([remoteData, applicativeF]) => ap(remoteData, applicativeF)
  )
