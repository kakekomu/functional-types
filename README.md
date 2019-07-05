# RemoteData

[![CircleCI](https://circleci.com/gh/kakekomu/remote-data.svg?style=svg)](https://circleci.com/gh/kakekomu/remote-data)
[![Types](https://img.shields.io/npm/types/@kakekomu/remote-data.svg)](https://npm.im/@kakekomu/remote-data)

RemoteData type for handling data from remote resources.
The idea is based on the [remotedata](https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/) Elm package
by Kris Jenkins.

RemoteData is an union type of four types representing the four possible states of a resource.

```typescript
type RemoteData<err, val> =
  | INotAsked
  | ILoading
  | IFailure<err>
  | ISuccess<val>
```

This means you will not need to handle the request state with booleans like `isFetching` or `isFailed`,
resulting in a much safer and concise code.

Under the hood, these four types are simple objects with a `type` field. You will need to do a
`switch` or `if` statement in order to get the wrapped value (see the example below).

### Main concerns
- usable with Next.js (to be able to use inside the getInitialProps method, it needs to be serializable)
- type safety
- Elm-like functional API

# Example use case

This simple example shows the main usage of this package.

```javascript
import React, { useState } from "react"
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
```

This example is written in plain JS but of course using TypeScript would be ideal.
It will yell at you if you try to access the value field without checking the status.

To convert the above example you will have to define the response type:

```typescript
interface IResp {
    args: {
        greeting: string
    }
}

const [webData, setWebData] = useState(NotAsked<AxiosError<any>, IResp>())

Remote.get<IResp>(`http://httpbin.org/get?greeting=HelloWorld`)
```

This will give you a `AsyncRemoteData<string, IResp>` which is the same as `Promise<RemoteData<string, IResp>>`

# Examples

You can find some simple example applications in the [examples](https://github.com/kakekomu/remote-data/tree/master/examples) folder.

### Starting the examples
 - Install dependencies with `npm install` or `yarn`
 - Build the remote-data library with `npm run build` or `yarn build` 
 - Start the bundler with `npm run start:examples` or `yarn start:examples`

# Helper functions

#### Remote.map
Map a function f over a RemoteData value.
If and only if the RemoteData value is a success, this function will
return a new RemoteData with its wrapped value applied to f.
Otherwise it returns the original RemoteData value.
 
*RemoteData err a -> (a -> b) -> RemoteData err b*

#### Remote.mapMany

Map a function f over a tuple of RemoteData values.
If and only if all the RemoteData values are successes, this function will
return a new RemoteData with its wrapped value applied to f.
Otherwise it returns the original RemoteData value.

*List (RemoteData err a) -> (List a -> b) -> RemoteData err b*

#### Remote.mapFailure

Map a function f over a RemoteData error.
If and only if the RemoteData value is a failure, this function will
return a new RemoteData with its wrapped error applied to f.
Otherwise it returns the original RemoteData.

*RemoteData err a -> (err -> errB) -> RemoteData errB a*

#### Remote.andThen

Otherwise it returns the original RemoteData value.
Also known as bind or flatMap. It is a good way to chain dependent actions.
If and only if the input value is a success, this function will
apply its wrapped value to f.
Otherwise it returns the original RemoteData.


*RemoteData err a -> (a -> RemoteData err b) -> RemoteData err b*

#### Remote.withDefault

Unwraps a RemoteData value to a primitive value with a default.
If and only if the RemoteData is a value this function will return its
wrapped value. Otherwise it will return the default value.

*RemoteData err a -> a -> a*

#### Remote.fromNullable

Creates a RemoteData value from nullable primitive value.
It will return a Failure if the input value is null or undefined.
Good for use with other libraries.

*a? -> err -> RemoteData err a*

#### Remote.ap
#### Remote.sequence
#### Remote.traverse
#### Remote.isNotAsked
#### Remote.isLoading
#### Remote.isFailure
#### Remote.isSuccess
