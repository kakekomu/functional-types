"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Result = require("@kakekomu/result-type");
/** RemoteData constructor function. No request is made to fetch remote data. */
exports.NotAsked = function () { return ({
    type: "NotAsked"
}); };
/** RemoteData constructor function. Request is made to fetch remote data. */
exports.Loading = function () { return ({
    type: "Loading"
}); };
/** RemoteData constructor function. Request to fetch failed. */
exports.Failure = function (error) { return ({
    type: "Failure",
    error: error
}); };
/** RemoteData constructor function. Request to fetch succeeded. */
exports.Success = function (value) { return ({
    type: "Success",
    value: value
}); };
/** Map a function f over a RemoteData value.
 *  If and only if the RemoteData value is a success, this function will
 *  return a new RemoteData with its wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  RemoteData err a -> (a -> b) -> RemoteData err b
 */
exports.map = function (remoteData, f) {
    return remoteData.type === "Success" ? exports.Success(f(remoteData.value)) : remoteData;
};
/** Map a function f over a tuple of RemoteData values.
 *  If and only if all the RemoteData values are successes, this function will
 *  return a new RemoteData with its wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  t (RemoteData err a) -> (t a -> b) -> RemoteData err b
 */
exports.mapMany = function (remoteArgs, f) {
    // @ts-ignore
    return exports.map(exports.sequence(remoteArgs), function (args) { return f.apply(void 0, args); });
};
/** Map a function f over a RemoteData error.
 *  If and only if the RemoteData value is a failure, this function will
 *  return a new RemoteData with its wrapped error applied to f.
 *  Otherwise it returns the original RemoteData.
 *
 *  RemoteData err a -> (err -> errB) -> RemoteData errB a
 */
exports.mapFailure = function (remoteData, f) {
    return remoteData.type === "Failure" ? exports.Failure(f(remoteData.error)) : remoteData;
};
/** Map two functions fErr and fVal for Failure and Success cases respectively.
 *  Same as Remote.mapFailure(Remote.map(remoteData, fVal), fErr)
 *
 *  RemoteData err val -> (err -> errB) -> (val -> valB) -> RemoteData errB valB
 */
exports.mapBoth = function (remoteData, fErr, fVal) {
    return remoteData.type === "Failure"
        ? exports.Failure(fErr(remoteData.error))
        : remoteData.type === "Success"
            ? exports.Success(fVal(remoteData.value))
            : remoteData;
};
/** List (RemoteData err a) -> RemoteData err (List a) */
exports.sequence = function (remoteDataList) {
    return remoteDataList.reduce(function (prev, current) {
        return prev.type === "Success" && current.type === "Success"
            ? exports.Success(prev.value.concat([current.value]))
            : prev.type === "Success" && current.type !== "Success"
                ? current
                : prev;
    }, exports.Success([]));
};
/** List a -> (a -> RemoteData err a) -> RemoteData err (List a) */
exports.traverse = function (valueList, f) {
    return valueList.reduce(function (prev, current) {
        var applied = f(current);
        return prev.type === "Success" && applied.type === "Success"
            ? exports.Success(prev.value.concat([applied.value]))
            : prev.type === "Success" && applied.type !== "Success"
                ? current
                : prev;
    }, exports.Success([]));
};
/** Also known as bind or flatMap. It is a good way to chain dependent actions.
 *  If and only if the input value is a success, this function will
 *  apply its wrapped value to f.
 *  Otherwise it returns the original RemoteData.
 *
 *  RemoteData err a -> (a -> RemoteData err b) -> RemoteData err b
 */
exports.andThen = function (remoteData, f) {
    return remoteData.type === "Success" ? f(remoteData.value) : remoteData;
};
/** Also known as apply. Same as map, but the function that operates on the
 *  value is also wrapped in a RemoteData.
 *  If and only if both RemoteData values are successes, this function will
 *  return the wrapped value applied to f.
 *  Otherwise it returns the original RemoteData value.
 *
 *  RemoteData err a -> RemoteData err (a -> b) -> RemoteData err b
 */
exports.ap = function (remoteData, applicativeF) {
    return applicativeF.type === "Success"
        ? exports.map(remoteData, applicativeF.value)
        : applicativeF;
};
/** Unwraps a RemoteData value to a primitive value with a default.
 *  If and only if the RemoteData is a value this function will return its
 *  wrapped value. Otherwise it will return the default value.
 *
 *  RemoteData err a -> a -> a
 */
exports.withDefault = function (remoteData, defaultValue) { return (remoteData.type === "Success" ? remoteData.value : defaultValue); };
/** Creates a RemoteData value from nullable primitive value.
 *  It will return a Failure if the input value is null or undefined.
 *  Good for use with other libraries.
 *
 *  a? -> err -> RemoteData err a
 */
exports.fromNullable = function (testedValue, errorMessage) {
    return testedValue !== null &&
        testedValue !== undefined &&
        (typeof testedValue !== "number" || !isNaN(testedValue))
        ? exports.Success(testedValue)
        : exports.Failure(errorMessage);
};
/** Helper function to determine if a RemoteData is a success */
exports.isNotAsked = function (remoteData) {
    return remoteData.type === "NotAsked";
};
/** Helper function to determine if a RemoteData is a success */
exports.isLoading = function (remoteData) {
    return remoteData.type === "Loading";
};
/** Helper function to determine if a RemoteData is a success */
exports.isSuccess = function (remoteData) {
    return remoteData.type === "Success";
};
/** Helper function to determine if a RemoteData is a failure */
exports.isFailure = function (remoteData) {
    return remoteData.type === "Failure";
};
/** Converts a RemoteData type to a Result type with a default error value
 *
 *  RemoteData err a -> err -> Result err a
 */
exports.toResult = function (remoteData, defaultError) {
    return remoteData.type === "Success"
        ? Result.Ok(remoteData.value)
        : remoteData.type === "Failure"
            ? Result.Err(remoteData.error)
            : Result.Err(defaultError);
};
//# sourceMappingURL=remote-data.js.map