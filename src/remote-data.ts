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

/** List (RemoteData err a) -> RemoteData err (List a) */
export const sequence = <err, val>(
  remoteDataList: Array<RemoteData<err, val>>
): RemoteData<err, val[]> =>
  remoteDataList.reduce((prev, current) => {
    if (prev.type === "Success" && current.type === "Success") {
      return Success([...prev.value, current.value])
    } else if (prev.type === "Success" && current.type !== "Success") {
      return current
    } else {
      return prev
    }
  }, Success([]))

/** List a -> (a -> RemoteData err a) -> RemoteData err (List a) */
export const traverse = <err, val>(
  valueList: val[],
  f: (value: val) => RemoteData<err, val>
) =>
  valueList.reduce((prev, current) => {
    const applied = f(current)
    if (prev.type === "Success" && applied.type === "Success") {
      return Success([...prev.value, applied.value])
    } else if (prev.type === "Success" && applied.type !== "Success") {
      return current
    } else {
      return prev
    }
  }, Success([]))

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
 *  RemoteData err a -> RemoteData err (a -> b) -> RemoteData err b
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
 *
 *  RemoteData err a -> a -> a
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
 *
 *  a? -> err -> RemoteData err a
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
