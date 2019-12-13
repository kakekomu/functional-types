import { Ok, Err } from "@kakekomu/result-type"
import { schema } from "../src/object"
import * as string from "../src/string"

describe("object validators", () => {
  describe("schema validator", () => {
    describe("flat schema", () => {
      const schemaValidator = schema("invalid object", {
        fieldA: string.max("too long", 4),
        fieldB: string.min("too short", 4),
        fieldC: string.onlyNumbers("not a number")
      })

      it("succeeds when every property of the object succeeds", () =>
        expect(
          schemaValidator({
            fieldA: "1234",
            fieldB: "1234",
            fieldC: "1234"
          })
        ).toEqual(
          Ok({
            fieldA: "1234",
            fieldB: "1234",
            fieldC: "1234"
          })
        ))

      it("fails when the object type doesn't match the schema", () => {
        const anyObj: any = {
          fieldA: "1234",
          fieldB: "1234"
        }
        expect(schemaValidator(anyObj)).toEqual(Err(["invalid object"]))
      })

      it("fails when any property of the object fails", () =>
        expect(
          schemaValidator({
            fieldA: "1234",
            fieldB: "123",
            fieldC: "1234"
          })
        ).toEqual(Err(["too short"])))

      it("collects error messages when many properties of the object fail", () =>
        expect(
          schemaValidator({
            fieldA: "1234",
            fieldB: "123",
            fieldC: "1234a"
          })
        ).toEqual(Err(["too short", "not a number"])))
    })

    describe("nested schema", () => {
      const schemaValidator = schema("invalid object", {
        fieldA: string.max("too long", 4),
        fieldB: string.min("too short", 4),
        fieldC: schema("invalid object", {
          nestedFieldA: string.onlyNumbers("not a number"),
          nestedFieldB: string.onlyLowcases("not a lowcase")
        })
      })

      it("succeeds when every property of the object succeeds", () =>
        expect(
          schemaValidator({
            fieldA: "1234",
            fieldB: "1234",
            fieldC: {
              nestedFieldA: "123",
              nestedFieldB: "abc"
            }
          })
        ).toEqual(
          Ok({
            fieldA: "1234",
            fieldB: "1234",
            fieldC: {
              nestedFieldA: "123",
              nestedFieldB: "abc"
            }
          })
        ))

      it("fails when any property of the object fails", () =>
        expect(
          schemaValidator({
            fieldA: "1234",
            fieldB: "123",
            fieldC: {
              nestedFieldA: "123",
              nestedFieldB: "abc"
            }
          })
        ).toEqual(Err(["too short"])))

      it("collects error messages when many properties of the object fail", () =>
        expect(
          schemaValidator({
            fieldA: "12345",
            fieldB: "1234",
            fieldC: {
              nestedFieldA: "123",
              nestedFieldB: "abc123"
            }
          })
        ).toEqual(Err(["too long", "not a lowcase"])))
    })
  })
})
