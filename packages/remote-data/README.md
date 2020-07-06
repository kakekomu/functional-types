# RemoteData

RemoteData type for handling data from remote resources.
The idea is based on the [remotedata](https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/) Elm package
by Kris Jenkins.

RemoteData is an union type of four types representing the four possible states of a resource.

```typescript
type RemoteData<err, val> = NotAsked | Loading | Failure<err> | Success<val>
```

This means you will not need to handle the request state with booleans like `isFetching` or `isFailed`,
resulting in a much safer and concise code.

Under the hood, these four types are simple objects with a `type` field. You can use a
`switch` or `if` statement to get the wrapped value (see the example below).

# Example use case

This simple example shows the main usage of this package.

```javascript
import React, { useState } from "react"
import { NotAsked, Loading } from "@kakekomu/remote-data"
import * as remote from "@kakekomu/remote-data"

const SimpleExample = () => {
  const [webData, setWebData] = useState(NotAsked())

  const fetchGreeting = () => {
    // Setting the webData to Loading before starting the request
    setWebData(Loading())

    // The remote.get function is a wrapper around axios' get function.
    // It makes an HTTP get request, and returns a Failure with the error message or a
    // Success with the response object.
    remote.get("http://httpbin.org/get?greeting=Hello%20World").then(resp => {
      // We could simply set the webData to the response, or do some mapping on it.
      // This time we take the greeting out of the response body.
      setWebData(remote.map(resp, resBody => resBody.args.greeting))
    })
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

export default SimpleExample
```

This example is written in plain JS but of course using TypeScript would be ideal.
It will yell at you if you try to access the value field without checking the status.

To convert the above example you will have to define the response type:

```typescript
interface Resp {
  args: {
    greeting: string
  }
}

const [webData, setWebData] = useState(NotAsked<AxiosError<any>, Resp>())

remote.get<Resp>(`http://httpbin.org/get?greeting=HelloWorld`)
```

This will give you a `AsyncRemoteData<string, Resp>` which is the same as `Promise<RemoteData<string, Resp>>`

You can find some simple example applications in the [examples](https://github.com/kakekomu/functional-types/tree/master/examples) folder.

# Helper functions

#### remote.map

Map a function f over a RemoteData value.
If and only if the RemoteData value is a success, this function will
return a new RemoteData with its wrapped value applied to f.
Otherwise it returns the original RemoteData value.

_RemoteData err a -> (a -> b) -> RemoteData err b_

#### remote.mapMany

Map a function f over a tuple of RemoteData values.
If and only if all the RemoteData values are successes, this function will
return a new RemoteData with its wrapped value applied to f.
Otherwise it returns the original RemoteData value.

_List (RemoteData err a) -> (List a -> b) -> RemoteData err b_

#### remote.mapFailure

Map a function f over a RemoteData error.
If and only if the RemoteData value is a failure, this function will
return a new RemoteData with its wrapped error applied to f.
Otherwise it returns the original RemoteData.

_RemoteData err a -> (err -> errB) -> RemoteData errB a_

#### remote.andThen

Otherwise it returns the original RemoteData value.
Also known as bind or flatMap. It is a good way to chain dependent actions.
If and only if the input value is a success, this function will
apply its wrapped value to f.
Otherwise it returns the original RemoteData.

_RemoteData err a -> (a -> RemoteData err b) -> RemoteData err b_

#### remote.withDefault

Unwraps a RemoteData value to a primitive value with a default.
If and only if the RemoteData is a value this function will return its
wrapped value. Otherwise it will return the default value.

_RemoteData err a -> a -> a_

#### remote.fromNullable

Creates a RemoteData value from nullable primitive value.
It will return a Failure if the input value is null or undefined.
Good for use with other libraries.

_a? -> err -> RemoteData err a_

#### remote.ap

#### remote.sequence

#### remote.traverse

#### remote.mapAsync

#### remote.mapFailureAsync

#### remote.mapBothAsync

#### remote.apAsync

#### remote.sequenceAsync

#### remote.isNotAsked

#### remote.isLoading

#### remote.isFailure

#### remote.isSuccess
