// RemoteData type constructors

export type RemoteData<err, val> =
  | INotAsked
  | ILoading
  | IFailure<err>
  | ISuccess<val>

/** Type representing a remote data. No request is made to fetch remote data. */
export interface INotAsked {
  type: "NotAsked"
}

/** RemoteData constructor function. No request is made to fetch remote data. */
export const NotAsked = <err, val>(): RemoteData<err, val> => ({
  type: "NotAsked"
})

/** Type representing a remote data. Request is made to fetch remote data. */
export interface ILoading {
  type: "Loading"
}

/** RemoteData constructor function. Request is made to fetch remote data. */
export const Loading = <err, val>(): RemoteData<err, val> => ({
  type: "Loading"
})

/** Type representing a remote data. Request to fetch failed. */
export interface IFailure<err> {
  type: "Failure"
  error: err
}

/** RemoteData constructor function. Request to fetch failed. */
export const Failure = <err, val>(error: err): RemoteData<err, val> => ({
  type: "Failure",
  error
})

/** Type representing a remote data. Request to fetch succeeded. */
export interface ISuccess<val> {
  type: "Success"
  value: val
}

/** RemoteData constructor function. Request to fetch succeeded. */
export const Success = <err, val>(value: val): RemoteData<err, val> => ({
  type: "Success",
  value
})

/** Type representing a remote data in a Promise. */
export type AsyncRemoteData<err, val> = Promise<RemoteData<err, val>>

// Mapping
export type UnRemoteData<T> = T extends { type: "Success"; value: infer V }
  ? V
  : never

export type RemoteDataList<err, T> = { [K in keyof T]: RemoteData<err, T[K]> }

export type UnRemoteDataList<T> = { [K in keyof T]: UnRemoteData<T[K]> }

type Head<T extends any[]> = T extends [any, ...any[]] ? T[0] : never

type Tail<T extends any[]> = ((...t: T) => any) extends ((
  _: any,
  ...tail: infer TT
) => any)
  ? TT
  : []

type CurriedFunction<T extends any[], R> = T extends []
  ? R
  : (arg: Head<T>) => CurriedFunction<Tail<T>, R>

/** Map a function f over a RemoteData value.
 *  If and only if the RemoteData value is a success, this function will
 *  return a new RemoteData with its wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  m a -> (a -> b) -> m b
 */
export const map = <err, val, returnVal>(
  remoteData: RemoteData<err, val>,
  f: (value: val) => returnVal
): RemoteData<err, returnVal> => {
  switch (remoteData.type) {
    case "Success": {
      return Success(f(remoteData.value))
    }
    default: {
      return remoteData
    }
  }
}

/** Map a function f over a list of RemoteData values.
 *  If and only if all the RemoteData values are successes, this function will
 *  return a new RemoteData with its wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  [m a] -> ([a] -> b) -> m b
 */
export const mapMany = <
  err,
  remoteDataArgs extends Array<RemoteData<err, any>>,
  returnVal
>(
  remoteDataList: remoteDataArgs,
  functor: CurriedFunction<UnRemoteDataList<remoteDataArgs>, returnVal>
): RemoteData<err, returnVal> =>
  remoteDataList.reduce((prev, current) => ap(current, prev), Success(functor))

export const mapFailure = <err, val, newerr>(
  remoteData: RemoteData<err, val>,
  f: (error: err) => newerr
): RemoteData<newerr, val> => {
  switch (remoteData.type) {
    case "Failure": {
      return Failure(f(remoteData.error))
    }
    default: {
      return remoteData
    }
  }
}

/** Also known as bind or flatMap.
 *  If and only if the RemoteData value is a success, this function will
 *  return the wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  m a -> (a -> m b) -> m b
 */
export const andThen = <err, val, returnVal>(
  remoteData: RemoteData<err, val>,
  f: (value: val) => RemoteData<err, returnVal>
): RemoteData<err, returnVal> => {
  switch (remoteData.type) {
    case "Success": {
      return f(remoteData.value)
    }
    default: {
      return remoteData
    }
  }
}

/** Also known as apply. Same as map, but the function that operates on the
 *  value is also wrapped in a RemoteData.
 *  If and only if both RemoteData values are successes, this function will
 *  return the wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  m a -> m (a -> b) -> m b
 */
export const ap = <err, val, returnVal>(
  remoteData: RemoteData<err, val>,
  applicativeF: RemoteData<err, (value: val) => returnVal>
): RemoteData<err, returnVal> => {
  switch (applicativeF.type) {
    case "Success": {
      return map(remoteData, applicativeF.value)
    }
    default: {
      return applicativeF
    }
  }
}

/** Unwraps a RemoteData value to a primitive value with a default.
 *  If and only if the RemoteData is a value this function will return its
 *  wrapped value. Otherwise it will return the default value.
 */
export const withDefault = <err, val>(
  remoteData: RemoteData<err, val>,
  defaultValue: val
): val => {
  switch (remoteData.type) {
    case "Success": {
      return remoteData.value
    }
    default: {
      return defaultValue
    }
  }
}

/** Creates a RemoteData value from nullable primitive value.
 *  It will return a Failure if the input value is null or undefined.
 *  Good for use with other libraries.
 */
export const fromNullable = <err, val>(
  testedValue: val | undefined | null,
  errorMessage: err
): RemoteData<err, val> =>
  testedValue ? Success(testedValue) : Failure(errorMessage)

/** Helper function to determine if a RemoteData is a success */
export const isNotAsked = <err, val>(remoteData: RemoteData<err, val>) =>
  remoteData.type === "NotAsked"

/** Helper function to determine if a RemoteData is a success */
export const isLoading = <err, val>(remoteData: RemoteData<err, val>) =>
  remoteData.type === "Loading"

/** Helper function to determine if a RemoteData is a success */
export const isSuccess = <err, val>(remoteData: RemoteData<err, val>) =>
  remoteData.type === "Success"

/** Helper function to determine if a RemoteData is a failure */
export const isFailure = <err, val>(remoteData: RemoteData<err, val>) =>
  remoteData.type === "Failure"
