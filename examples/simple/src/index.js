import React, { useState } from "react"
import ReactDOM from "react-dom"
import Remote, { NotAsked, Loading } from "@kakekomu/remote-data"

const App = () => {
    const [webData, setWebData] = useState(NotAsked())

    const fetchGreeting = () => {
        // Setting the webData to Loading before starting the request
        setWebData(Loading())

        // The Remote.get function is a wrapper around axios' get function. 
        // It makes an HTTP get request, and returns a Failure with the error message or a 
        // Success with the response object.
        Remote.get(`http://httpbin.org/get?greeting=${encodeURI("Hello World!")}`)
            .then(resp => {
                // We could simply set the webData to the response, or do some mapping on it.
                // This time we take the greeting out of the response body.
                setWebData(Remote.map(resp, resBody => resBody.args.greeting))
            })
    }

    // We can switch the rendered HTML based on the state of our webData
    switch(webData.type) {
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

const domContainer = document.querySelector("#react")
ReactDOM.render(React.createElement(App), domContainer)
