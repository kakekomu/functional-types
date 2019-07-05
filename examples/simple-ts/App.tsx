import { AxiosError } from "axios"
import React, { FunctionComponent, useState } from "react"
// import Remote, { Loading, NotAsked } from "@kakekomu/remote-data"
import Remote, { Loading, NotAsked } from "../../src/index"

interface IResp {
  args: {
    greeting: string
  }
}

const App: FunctionComponent = () => {
  const [webData, setWebData] = useState(NotAsked<AxiosError<any>, string>())

  const fetchGreeting = () => {
    // Setting the webData to Loading before starting the request
    setWebData(Loading())

    // The Remote.get function is a wrapper around axios' get function.
    // It makes an HTTP get request, and returns a Failure with the error message or a
    // Success with the response object.
    Remote.get<IResp>("http://httpbin.org/get?greeting=Hello%20World").then(
      resp => {
        // We could simply set the webData to the response, or do some mapping on it.
        // This time we take the greeting out of the response body.
        setWebData(Remote.map(resp, resBody => resBody.args.greeting))
      }
    )
  }

  // We can switch the rendered HTML based on the state of our webData
  switch (webData.type) {
    case "NotAsked": {
      return <button onClick={fetchGreeting}>Fetch</button>
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

export default App
