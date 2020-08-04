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

export type WebData<T, E = unknown> = RemoteData<AxiosError<E>, T>
export type AsyncWebData<T, E = unknown> = AsyncRemoteData<AxiosError<E>, T>

export interface Optionals<D, H> {
  data?: D
  headers?: H
}

export const request = (method: HTTPMethod) => <
  T,
  D = undefined,
  H = undefined,
  E = unknown
>(
  url: string,
  optionals: Optionals<D, H> = {}
): AsyncWebData<T, E> =>
  axios({
    method,
    url,
    data: optionals.data,
    headers: optionals.headers
  })
    .then((response: AxiosResponse<T>) =>
      Success<AxiosError<E>, T>(response.data)
    )
    .catch((error: AxiosError<E>) => Failure<AxiosError<E>, T>(error))

export const get = request("get")
export const post = request("post")
export const patch = request("patch")
export const put = request("put")
export const del = request("delete")

export const useRemoteData = <T, A, E = unknown>(
  requestF: (...reqArgs: A[]) => AsyncRemoteData<E, T>
): [RemoteData<E, T>, (...reqArgs: A[]) => void] => {
  const [remoteData, setRemoteData] = useState(NotAsked<E, T>())

  const fetchRemoteData = (...args: A[]) => {
    if (isNotAsked(remoteData)) {
      setRemoteData(Loading())
      requestF(...args).then(setRemoteData)
    }
  }

  return [remoteData, fetchRemoteData]
}
