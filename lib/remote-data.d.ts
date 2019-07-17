import * as Result from "@kakekomu/result-type";
export declare type RemoteData<err, val> = INotAsked | ILoading | IFailure<err> | ISuccess<val>;
/** Type representing a remote data. No request is made to fetch remote data. */
export interface INotAsked {
    type: "NotAsked";
}
/** RemoteData constructor function. No request is made to fetch remote data. */
export declare const NotAsked: <err, val>() => RemoteData<err, val>;
/** Type representing a remote data. Request is made to fetch remote data. */
export interface ILoading {
    type: "Loading";
}
/** RemoteData constructor function. Request is made to fetch remote data. */
export declare const Loading: <err, val>() => RemoteData<err, val>;
/** Type representing a remote data. Request to fetch failed. */
export interface IFailure<err> {
    type: "Failure";
    error: err;
}
/** RemoteData constructor function. Request to fetch failed. */
export declare const Failure: <err, val>(error: err) => RemoteData<err, val>;
/** Type representing a remote data. Request to fetch succeeded. */
export interface ISuccess<val> {
    type: "Success";
    value: val;
}
/** RemoteData constructor function. Request to fetch succeeded. */
export declare const Success: <err, val>(value: val) => RemoteData<err, val>;
/** Type representing a remote data in a Promise. */
export declare type AsyncRemoteData<err, val> = Promise<RemoteData<err, val>>;
export declare type UnRemoteData<T> = T extends {
    type: "Success";
    value: infer V;
} ? V : never;
export declare type RemoteDataList<err, T> = {
    [K in keyof T]: RemoteData<err, T[K]>;
};
/** Map a function f over a RemoteData value.
 *  If and only if the RemoteData value is a success, this function will
 *  return a new RemoteData with its wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  RemoteData err a -> (a -> b) -> RemoteData err b
 */
export declare const map: <err, val, returnVal>(remoteData: RemoteData<err, val>, f: (value: val) => returnVal) => RemoteData<err, returnVal>;
declare type GetErrorType<T> = T extends RemoteDataList<infer err, any[]> ? err : never;
declare type GetValueType<T> = T extends RemoteDataList<any, infer vals> ? vals : never;
/** Map a function f over a tuple of RemoteData values.
 *  If and only if all the RemoteData values are successes, this function will
 *  return a new RemoteData with its wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  t (RemoteData err a) -> (t a -> b) -> RemoteData err b
 */
export declare const mapMany: <remoteVals extends any[], returnVal>(remoteArgs: remoteVals, f: (...args: GetValueType<remoteVals>) => returnVal) => RemoteData<GetErrorType<remoteVals>, returnVal>;
/** Map a function f over a RemoteData error.
 *  If and only if the RemoteData value is a failure, this function will
 *  return a new RemoteData with its wrapped error applied to f.
 *  Otherwise it returns the original RemoteData.
 *
 *  RemoteData err a -> (err -> errB) -> RemoteData errB a
 */
export declare const mapFailure: <err, val, newerr>(remoteData: RemoteData<err, val>, f: (error: err) => newerr) => RemoteData<newerr, val>;
/** Map two functions fErr and fVal for Failure and Success cases respectively.
 *  Same as Remote.mapFailure(Remote.map(remoteData, fVal), fErr)
 *
 *  RemoteData err val -> (err -> errB) -> (val -> valB) -> RemoteData errB valB
 */
export declare const mapBoth: <err, val, newerr, newval>(remoteData: RemoteData<err, val>, fErr: (error: err) => newerr, fVal: (value: val) => newval) => RemoteData<newerr, newval>;
/** List (RemoteData err a) -> RemoteData err (List a) */
export declare const sequence: <err, val>(remoteDataList: RemoteData<err, val>[]) => RemoteData<err, val[]>;
/** List a -> (a -> RemoteData err a) -> RemoteData err (List a) */
export declare const traverse: <err, val>(valueList: val[], f: (value: val) => RemoteData<err, val>) => INotAsked | ILoading | IFailure<unknown> | val | ISuccess<val[]>;
/** Also known as bind or flatMap. It is a good way to chain dependent actions.
 *  If and only if the input value is a success, this function will
 *  apply its wrapped value to f.
 *  Otherwise it returns the original RemoteData.
 *
 *  RemoteData err a -> (a -> RemoteData err b) -> RemoteData err b
 */
export declare const andThen: <err, val, returnVal>(remoteData: RemoteData<err, val>, f: (value: val) => RemoteData<err, returnVal>) => RemoteData<err, returnVal>;
/** Also known as apply. Same as map, but the function that operates on the
 *  value is also wrapped in a RemoteData.
 *  If and only if both RemoteData values are successes, this function will
 *  return the wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  RemoteData err a -> RemoteData err (a -> b) -> RemoteData err b
 */
export declare const ap: <err, val, returnVal>(remoteData: RemoteData<err, val>, applicativeF: RemoteData<err, (value: val) => returnVal>) => RemoteData<err, returnVal>;
/** Unwraps a RemoteData value to a primitive value with a default.
 *  If and only if the RemoteData is a value this function will return its
 *  wrapped value. Otherwise it will return the default value.
 *
 *  RemoteData err a -> a -> a
 */
export declare const withDefault: <err, val>(remoteData: RemoteData<err, val>, defaultValue: val) => val;
/** Creates a RemoteData value from nullable primitive value.
 *  It will return a Failure if the input value is null or undefined.
 *  Good for use with other libraries.
 *
 *  a? -> err -> RemoteData err a
 */
export declare const fromNullable: <err, val>(testedValue: val | null | undefined, errorMessage: err) => RemoteData<err, val>;
/** Helper function to determine if a RemoteData is a success */
export declare const isNotAsked: <err, val>(remoteData: RemoteData<err, val>) => boolean;
/** Helper function to determine if a RemoteData is a success */
export declare const isLoading: <err, val>(remoteData: RemoteData<err, val>) => boolean;
/** Helper function to determine if a RemoteData is a success */
export declare const isSuccess: <err, val>(remoteData: RemoteData<err, val>) => boolean;
/** Helper function to determine if a RemoteData is a failure */
export declare const isFailure: <err, val>(remoteData: RemoteData<err, val>) => boolean;
/** Converts a RemoteData type to a Result type with a default error value
 *
 *  RemoteData err a -> err -> Result err a
 */
export declare const toResult: <err, val>(remoteData: RemoteData<err, val>, defaultError: err) => Result.Result<err, val>;
export {};
