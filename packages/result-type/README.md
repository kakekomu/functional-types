# Result

Result type for error handling.
This is a frequently used approach for handling results of side effects in functinal languages,
sometimes called an Either type.

Result is an union type.

```typescript
type Result<err, val> = Err<err> | Ok<val>
```

Under the hood, these four types are simple objects with a `type` field. You can use a
`switch` or `if` statement to get the wrapped value (see the example below).
