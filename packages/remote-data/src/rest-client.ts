import axios, { AxiosError, AxiosResponse } from "axios"
import { useState } from "react"
import {
  AsyncRemoteData,
  Failure,
  isNotAsked,
  Loading,
  NotAsked,
  RemoteData,
  Success
} from "./remote-data"

type HTTPMethod = "get" | "post" | "put" | "patch" | "delete"

export type WebData<T> = RemoteData<string, T>
export type AsyncWebData<T> = AsyncRemoteData<string, T>

export interface Optionals<D, H> {
  data?: D
  headers?: H
}

export const errorToString = (
  url: string,
  method: string,
  error: AxiosError
): string => {
  const errorMsg =
    (error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.message) ||
    error.message ||
    "Request error."

  return `${method.toUpperCase()} ${url} failed: ${errorMsg}`
}

export const request = (method: HTTPMethod) => <
  T,
  D = undefined,
  H = undefined
>(
  url: string,
  optionals: Optionals<D, H> = {}
): AsyncWebData<T> =>
  axios({
    method,
    url,
    data: optionals.data,
    headers: optionals.headers
  })
    .then((response: AxiosResponse<T>) => Success<string, T>(response.data))
    .catch((error: AxiosError) =>
      Failure<string, T>(errorToString(url, method, error))
    )

export const get = request("get")
export const post = request("post")
export const patch = request("patch")
export const put = request("put")
export const del = request("delete")

export const useRemoteData = <T>(
  requestF: () => AsyncWebData<T>
): [WebData<T>, () => void] => {
  const [remoteData, setRemoteData] = useState(NotAsked<string, T>())

  const fetchRemoteData = () => {
    if (isNotAsked(remoteData)) {
      setRemoteData(Loading())
      requestF().then(setRemoteData)
    }
  }

  return [remoteData, fetchRemoteData]
}
