import * as remote from "@kakekomu/remote-data"
import React, { FunctionComponent } from "react"

interface IResp {
  args: {
    greeting: string
  }
}

const ReactHooksExample: FunctionComponent = () => {
  // The useRemoteData hook takes care of the whole lifecycle.
  // The fetchRemoteData will trigger the request.
  const [webData, fetchRemoteData] = remote.useRemoteData(() =>
    remote.mapAsync(
      remote.get<IResp>("http://httpbin.org/get?greeting=Hello%20World"),
      resBody => resBody.args.greeting
    )
  )

  // We can switch the rendered HTML based on the state of our webData
  switch (webData.type) {
    case "NotAsked": {
      return <button onClick={fetchRemoteData}>Fetch</button>
    }
    case "Loading": {
      return <div>Loading...</div>
    }
    case "Failure": {
      // The error field is only available on Failure
      const error = webData.error
      return <div>Error: {error}</div>
    }
    case "Success": {
      // The value field is only available on Success
      const greeting = webData.value
      return <div>{greeting}</div>
    }
  }
}

export default ReactHooksExample
