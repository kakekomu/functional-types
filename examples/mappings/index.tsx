import { Loading, NotAsked } from "@kakekomu/remote-data"
import * as remote from "@kakekomu/remote-data"
import React, { FunctionComponent, useState } from "react"

interface IGreetingResp {
  args: {
    greeting: string
  }
}

interface INameParams {
  name: string
}

interface INameResp {
  json: {
    name: string
  }
}

interface IUUIDResp {
  uuid: string
}

interface IWebData {
  greeting: string
  name: string
  uuid: string
}

const MappingsExample: FunctionComponent = () => {
  const [webData, setWebData] = useState<remote.WebData<IWebData>>(NotAsked())
  const [nameInput, setNameInput] = useState("")

  const fetchWebData = async () => {
    setWebData(Loading())

    // Doing multiple requests at once
    const responses = await Promise.all([
      remote.get<IGreetingResp>("http://httpbin.org/get?greeting=Hello"),
      remote.post<INameResp, INameParams>("http://httpbin.org/post", {
        name: nameInput
      }),
      remote.get<IUUIDResp>("https://httpbin.org/uuid")
    ])

    // Mapping the list of RemoteData to a constructor function
    // List (RemoteData a) -> (List a -> b) -> RemoteData b
    const newWebData = remote.mapMany(
      responses,
      (greetingResp, nameResp, uuidResp) => ({
        greeting: greetingResp.args.greeting,
        name: nameResp.json.name,
        uuid: uuidResp.uuid
      })
    )

    setWebData(newWebData)
  }

  const handleEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.currentTarget.value)
  }

  switch (webData.type) {
    case "NotAsked": {
      return (
        <div>
          <label>Enter your name: </label>
          <input onChange={handleEvent} />
          <button onClick={fetchWebData}>Fetch</button>
        </div>
      )
    }
    case "Loading": {
      return (
        <div>
          <div>Loading...</div>
        </div>
      )
    }
    case "Failure": {
      const error = webData.error
      return (
        <div>
          <div>Error: {error}</div>
        </div>
      )
    }
    case "Success": {
      const { greeting, name, uuid } = webData.value
      return (
        <div>
          <div>{`${greeting} ${name}`}</div>
          <div>UUID: {uuid}</div>
        </div>
      )
    }
  }
}

export default MappingsExample
