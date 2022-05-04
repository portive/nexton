/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as s from "superstruct"
import { logger, API, Mock } from "~/src"

describe("method", () => {
  it("should execute a simple mock call on a handler", async () => {
    const handler = API.withHandler(
      async (props) => {
        return { ...props, b: 1 }
      },
      { log: false }
    )
    const [response] = await Mock.callHandler(handler, { a: "alpha" })
    expect(response).toEqual({ a: "alpha", b: 1 })
  })

  describe("withHandler", () => {
    const Props = s.object({ name: s.string() })
    const handler = API.handler(Props, async (props) => {
      const at = new Date("2022-04-26")
      return { status: "success", data: { message: `Hello ${props.name}`, at } }
    })

    it("should have all the parts of handler", async () => {
      const logs = await logger.collect(async () => {
        const [result] = await Mock.callHandler(handler, { name: "John Doe" })
        expect(result).toEqual({
          status: "success",
          data: {
            message: "Hello John Doe",
            at: {
              $date: 1650931200000,
            },
          },
        })
      })
      expect(logs.length).toEqual(2)
    })
  })

  describe("withCorsHandler", () => {
    it("should add CORS headers", async () => {
      const handler = API.withCorsHandler(
        API.withHandler(
          async () => {
            return { message: "Hello World" }
          },
          { log: false }
        )
      )
      const [, , res] = await Mock.callHandler(handler, {})
      const allowOrigin = res.getHeader("access-control-allow-origin")
      expect(allowOrigin).toEqual("*")
    })
  })

  describe("jsend", () => {
    const Props = s.object({
      name: s.string(),
    })

    const jsendHandler = API.jsend(Props, async (props) => {
      return { status: "success", data: { message: `Hello ${props.name}` } }
    })

    it("should handle a thrown error as jsend", async () => {
      const logs = await logger.collect(async () => {
        /**
         * The empty object will result in an error which should get returned
         * as a `jsend` Error object.
         */
        const [result] = await Mock.callHandler(jsendHandler, {})
        expect(result).toEqual({
          status: "error",
          message: expect.stringContaining(
            `Error validating input props: At path: name`
          ),
        })
      })
      expect(logs.length).toEqual(2)
    })
  })

  describe("handler", () => {
    const Props = s.object({
      name: s.string(),
    })

    it("should create a standard handler with no options", async () => {
      const handler = API.handler(Props, async (props) => {
        return { status: "success", data: { message: `Hello ${props.name}` } }
      })
      const chunks = await logger.collect(async () => {
        const [response, , res] = await Mock.callHandler(handler, {
          name: "John",
        })
        expect(response).toEqual({
          status: "success",
          data: { message: `Hello John` },
        })
        const allowOrigin = res.getHeader("access-control-allow-origin")
        expect(allowOrigin).toEqual(undefined)
      })
      expect(chunks.length).toEqual(2)
    })

    it("should create a standard handler with cors", async () => {
      const handler = API.handler(
        Props,
        async (props) => {
          return { status: "success", data: { message: `Hello ${props.name}` } }
        },
        { cors: true }
      )
      await logger.silence(async () => {
        const [response, , res] = await Mock.callHandler(handler, {
          name: "John",
        })
        expect(response).toEqual({
          status: "success",
          data: { message: `Hello John` },
        })
        const allowOrigin = res.getHeader("access-control-allow-origin")
        expect(allowOrigin).toEqual("*")
      })
    })

    it("should create a standard handler without logging", async () => {
      const handler = API.handler(
        Props,
        async (props) => {
          return { status: "success", data: { message: `Hello ${props.name}` } }
        },
        { log: false }
      )
      const chunks = await logger.collect(async () => {
        const [response] = await Mock.callHandler(handler, {
          name: "John",
        })
        expect(response).toEqual({
          status: "success",
          data: { message: `Hello John` },
        })
      })
      expect(chunks.length).toEqual(0)
    })
  })
})
