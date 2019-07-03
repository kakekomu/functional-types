import React, { useState } from "react"
import ReactDOM from "react-dom"
import Remote, { NotAsked, Loading, Success } from "@kakekomu/remote-data"

const App = () => {
    const [webData, setWebData] = useState(NotAsked())
    const [name, setName] = useState("")

    const fetchWebData = async () => {
        setWebData(Loading())

        // Doing multiple requests at once
        const responses = await Promise.all([
            Remote.get(`http://httpbin.org/get?greeting=Hello`),
            Remote.post("http://httpbin.org/post", { name }),
            Remote.get("https://httpbin.org/uuid")
        ])

        // Mapping the list of RemoteData to a constructor function
        // List (RemoteData a) -> (List a -> b) -> RemoteData b
        const newWebData = Remote.mapMany(responses, (greetingResp, nameResp, uuidResp) => ({
            greeting: greetingResp.args.greeting,
            name: nameResp.json.name,
            uuid: uuidResp.uuid
        }))

        setWebData(newWebData)
    }

    switch(webData.type) {
        case "NotAsked": {
            return (
                <div>
                    <input onChange={e => setName(e.target.value)} />
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

const domContainer = document.querySelector("#react")
ReactDOM.render(React.createElement(App), domContainer)
