import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import Remote from "@kakekomu/remote-data"

const App = () => {
  // The useRemoteData hook takes care of the whole lifecycle.
  // The fetchRemoteData will trigger the request.
  const [webData, fetchRemoteData] = Remote.useRemoteData(() =>
    Remote.get("http://httpbin.org/get?greeting=Hello%20World")
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

const domContainer = document.querySelector("#react")
ReactDOM.render(React.createElement(App), domContainer)