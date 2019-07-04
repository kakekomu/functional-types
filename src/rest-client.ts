import axios, { AxiosError, AxiosResponse } from "axios"
import { AsyncRemoteData, Failure, Success } from "./remote-data"

type HTTPMethod = "get" | "post" | "put" | "patch" | "delete"

export const request = (method: HTTPMethod) => <T, D = undefined>(
  url: string,
  data?: D
): AsyncRemoteData<AxiosError, T> =>
  axios({
    data,
    method,
    url
  })
    .then((response: AxiosResponse<T>) => Success<AxiosError, T>(response.data))
    .catch((error: AxiosError) => Failure<AxiosError, T>(error))

export const get = request("get")
export const post = request("post")
export const patch = request("patch")
export const put = request("put")
export const del = request("delete")
