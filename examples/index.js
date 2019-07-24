import ReactDOM from "react-dom"
import React, { useState } from "react"
import SimpleTSExample from "./simple-ts"
import SimpleExample from "./simple"
import MappingsExample from "./mappings"
import ReactHooksExample from "./react-hooks"

const Example = ({ children }) => (
  <div style={{ border: "1px solid gray", padding: "20px", marginTop: "10px" }}>
    {children}
  </div>
)

const App = () => (
  <div>
    <h1>RemoteData examples</h1>
    <section>
      <h2>Simple Example (Vanilla JS)</h2>
      <a href="simple/index.js">Source code</a>
      <Example>
        <SimpleExample />
      </Example>
    </section>
    <section>
      <h2>Simple Example (TypeScript)</h2>
      <a href="simple-ts/index.tsx">Source code</a>
      <Example>
        <SimpleTSExample />
      </Example>
    </section>
    <section>
      <h2>Mappings Example</h2>
      <a href="mappings/index.tsx">Source code</a>
      <Example>
        <MappingsExample />
      </Example>
    </section>
    <section>
      <h2>Using React Hooks (useRemoteData)</h2>
      <a href="react-hooks/index.tsx">Source code</a>
      <Example>
        <ReactHooksExample />
      </Example>
    </section>
  </div>
)

const domContainer = document.querySelector("#react")
ReactDOM.render(React.createElement(App), domContainer)
