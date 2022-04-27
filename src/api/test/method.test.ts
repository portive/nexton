/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as s from "superstruct"
import { AssertType } from "@thesunny/assert-type"
import { AsyncReturnType } from "type-fest"
import { logger } from "../../logger"
import { API, Mock } from "~/src"

describe("method", () => {
  const jestConsole = console

  beforeEach(() => {
    global.console = require("console")
  })

  afterEach(() => {
    global.console = jestConsole
  })

  it("should execute a simple mock call on a handler", async () => {
    const handler = API.withHandler(async (props) => {
      return { ...props, b: 1 }
    })
    const [response] = await Mock.callHandler(handler, { a: "alpha" })
    expect(response).toEqual({ a: "alpha", b: 1 })
  })

  describe("withLog", () => {
    it("should execute a handler with logging", async () => {
      const handler = API.withHandler(
        API.withLog(async (props) => {
          return { ...props, b: 1 }
        })
      )
      const logs = await logger.collect(async () => {
        const [response] = await Mock.callHandler(handler, { a: "alpha" })
        expect(response).toEqual({ a: "alpha", b: 1 })
      })
      expect(logs.length).toEqual(2)
      expect(logs[0]).toMatch(/== Request .* ==/)
      expect(logs[0]).toMatch(/a.*alpha/)
      expect(logs[1]).toMatch(/== Response .* ==/i)
      expect(logs[1]).toMatch(/b.*1/)
    })

    it("should execute a handler with logging that throws an error", async () => {
      const handler = API.withHandler(
        API.withLog(async () => {
          throw new Error("WTF")
        })
      )
      const logs = await logger.collect(async () => {
        const [response, , res] = await Mock.callHandler(handler, {
          a: "alpha",
        })
        expect(res.statusCode).toEqual(500)
        // TODO: Make the statusMessage say "Internal Server Error" (NextJS bug)
        // expect(res.statusMessage).toEqual("Internal Server Error")
        expect(response).toContain("WTF")
      })
      expect(logs[1]).toMatch(/== Error .* ==/)
      expect(logs[1]).toMatch(/Error: WTF/)
    })
  })

  describe("withDate", () => {
    it("should convert response to EJSON dates", async () => {
      const at = new Date("2000-01-01")
      const handler = API.withHandler(
        API.withDate(async () => {
          return { at }
        })
      )
      const [response] = await Mock.callHandler(handler, {})
      expect(response).toEqual({ at: { $date: 946684800000 } })
    })
  })

  describe("withJSend", () => {
    it("should limit responses to JSend compatible objects", async () => {
      API.withJSend(async () => {
        return { status: "success", data: { a: "alpha" } }
      })
    })

    it("should limit to dates within JSend", async () => {
      const at = new Date("2000-01-01")
      API.withDate(
        API.withJSend(async () => {
          return { status: "success", data: { at } }
        })
      )
    })
  })

  describe("withJsendError", () => {
    it("should turn an error into a jsend error", async () => {
      const method = API.withJSendError(async () => {
        throw new Error("WTF")
      })
      const response = await Mock.callMethod(method, {})
      expect(response).toEqual({
        status: "error",
        message: expect.stringContaining("Error: WTF"),
      })
    })
  })

  describe("withProps", () => {
    const Props = s.object({ name: s.string() })

    it("should type the incoming props", async () => {
      const method = API.withProps(Props, async (props) => {
        AssertType.Equal<typeof props, { name: string }>(true)
        return { greeting: `Hello ${props.name}` }
      })
      AssertType.Equal<AsyncReturnType<typeof method>, { greeting: string }>(
        true
      )
      const response = await Mock.callMethod(method, { name: "John Doe" })
      expect(response).toEqual({ greeting: "Hello John Doe" })
    })

    it("should throw on a bad prop", async () => {
      const method = API.withProps(Props, async (props) => {
        return { greeting: `Hello ${props.name}` }
      })
      await expect(
        // @ts-ignore
        Mock.callMethod(method, {})
      ).rejects.toThrow("At path: name -- Expected a string")
    })
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

    it("should handle a thrown error as jsend", async () => {
      const logs = await logger.collect(async () => {
        const [result] = await Mock.callHandler(handler, {})
        expect(result).toEqual({
          status: "error",
          message: expect.stringContaining(
            `Error validating API method props: At path: name`
          ),
        })
      })
      expect(logs.length).toEqual(2)
    })
  })

  describe("withCorsHandler", () => {
    it("should add CORS headers", async () => {
      const handler = API.withCorsHandler(
        API.withHandler(async () => {
          return { message: "Hello World" }
        })
      )
      const [, , res] = await Mock.callHandler(handler, {})
      const allowOrigin = res.getHeader("access-control-allow-origin")
      expect(allowOrigin).toEqual("*")
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
      const handler = API.handler(Props, { cors: true }, async (props) => {
        return { status: "success", data: { message: `Hello ${props.name}` } }
      })
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
      const handler = API.handler(Props, { log: false }, async (props) => {
        return { status: "success", data: { message: `Hello ${props.name}` } }
      })
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
