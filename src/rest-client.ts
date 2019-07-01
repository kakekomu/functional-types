import axios, { AxiosResponse } from "axios"
import { AsyncRemoteData, Failure, RemoteData, Success } from "./remote-data"

type HTTPMethod = "get" | "post" | "put" | "patch" | "delete"

export const request = (method: HTTPMethod) => <T, D = undefined>(
  url: string,
  data?: D
): AsyncRemoteData<string, T> =>
  axios({
    data,
    method,
    url
  })
    .then(
      (response: AxiosResponse<T>): RemoteData<string, T> =>
        response.status === 200
          ? Success(response.data)
          : Failure("Server error")
    )
    .catch(_ => Failure<string, T>(url))

export const get = request("get")
export const post = request("post")
export const patch = request("patch")
export const put = request("put")
