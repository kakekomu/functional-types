import * as http from "http"
import { isFailure, isSuccess } from "../remote-data"
import * as remote from "../rest-client"

let server: http.Server

describe("restClient methods", () => {
  beforeAll(async () => {
    // Creating a mock server
    server = http.createServer((req, res) => {
      if (
        (req.url === "/get" && req.method === "GET") ||
        (req.url === "/post" && req.method === "POST") ||
        (req.url === "/put" && req.method === "PUT") ||
        (req.url === "/patch" && req.method === "PATCH") ||
        (req.url === "/delete" && req.method === "DELETE")
      ) {
        res.statusCode = 200
      } else {
        res.statusCode = 500
      }
      res.end()
    })

    return new Promise(resolve => server.listen(4444, resolve))
  })

  afterAll(() => server.close())
  test("making a GET request", async () => {
    const response = await remote.get("http://localhost:4444/get")
    expect(isSuccess(response)).toBeTruthy()
  })

  test("making a POST request", async () => {
    const response = await remote.post("http://localhost:4444/post")
    expect(isSuccess(response)).toBeTruthy()
  })

  test("making a DELETE request", async () => {
    const response = await remote.del("http://localhost:4444/delete")
    expect(isSuccess(response)).toBeTruthy()
  })
  test("making a PATCH request", async () => {
    const response = await remote.patch("http://localhost:4444/patch")
    expect(isSuccess(response)).toBeTruthy()
  })
  test("making a PUT request", async () => {
    const response = await remote.put("http://localhost:4444/put")
    expect(isSuccess(response)).toBeTruthy()
  })

  test("handling failure", async () => {
    const response = await remote.get("http://localhost:4444/post")
    const errorMsg = isFailure(response) ? response.error : undefined
    expect(isFailure(response)).toBeTruthy()
    expect(errorMsg).toMatch("GET http://localhost:4444/post")
  })
})
