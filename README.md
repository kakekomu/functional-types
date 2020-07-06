# Elm-like functional types and helpers for TypeScript

- Result
- RemoteData
  RemoteData type for handling data from remote resources.
  The idea is based on the [remotedata](https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/) Elm package
  by Kris Jenkins.

### Main concerns

- usable with Next.js (to be able to use inside the getInitialProps method, it needs to be serializable)
- type safety
- Elm-like functional API

### Starting the examples

- Install dependencies with `npm install`
- Bootstrap monorepo `npm run bootstrap`
- Build the remote-data library with `npm run build`
- Start the bundler with `npm run start:examples`
