"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var react_1 = require("react");
var remote_data_1 = require("./remote-data");
exports.request = function (method) { return function (url, data) {
    return axios_1.default({
        data: data,
        method: method,
        url: url
    })
        .then(function (response) { return remote_data_1.Success(response.data); })
        .catch(function (error) { return remote_data_1.Failure(error); });
}; };
exports.get = exports.request("get");
exports.post = exports.request("post");
exports.patch = exports.request("patch");
exports.put = exports.request("put");
exports.del = exports.request("delete");
exports.useRemoteData = function (requestF) {
    var _a = react_1.useState(remote_data_1.NotAsked()), remoteData = _a[0], setRemoteData = _a[1];
    var fetchRemoteData = function () {
        if (remote_data_1.isNotAsked(remoteData)) {
            setRemoteData(remote_data_1.Loading());
            requestF().then(setRemoteData);
        }
    };
    return [remoteData, fetchRemoteData];
};
//# sourceMappingURL=rest-client.js.map