import * as http from "http"
import { isFailure, isSuccess } from "../remote-data"
import * as Remote from "../rest-client"

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
    const response = await Remote.get("http://localhost:4444/get")
    expect(isSuccess(response)).toBeTruthy()
  })

  test("making a POST request", async () => {
    const response = await Remote.post("http://localhost:4444/post")
    expect(isSuccess(response)).toBeTruthy()
  })

  test("making a DELETE request", async () => {
    const response = await Remote.del("http://localhost:4444/delete")
    expect(isSuccess(response)).toBeTruthy()
  })
  test("making a PATCH request", async () => {
    const response = await Remote.patch("http://localhost:4444/patch")
    expect(isSuccess(response)).toBeTruthy()
  })
  test("making a PUT request", async () => {
    const response = await Remote.put("http://localhost:4444/put")
    expect(isSuccess(response)).toBeTruthy()
  })

  test("handling failure", async () => {
    const response = await Remote.get("http://localhost:4444/post")
    expect(isFailure(response)).toBeTruthy()
  })
})
