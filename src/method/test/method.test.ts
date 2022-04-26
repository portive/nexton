/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as API from "~/src"
import * as s from "superstruct"
import { AssertType } from "@thesunny/assert-type"
import { AsyncReturnType } from "type-fest"

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
    const [response] = await API.callHandler(handler, { a: "alpha" })
    expect(response).toEqual({ a: "alpha", b: 1 })
  })

  describe("withLog", () => {
    it("should execute a handler with logging", async () => {
      const handler = API.withHandler(
        API.withLog(async (props) => {
          return { ...props, b: 1 }
        })
      )
      const [response] = await API.callHandler(handler, { a: "alpha" })
      expect(response).toEqual({ a: "alpha", b: 1 })
    })

    it("should execute a handler with logging that throws an error", async () => {
      const handler = API.withHandler(
        API.withLog(async () => {
          throw new Error("WTF")
        })
      )
      const [response, , res] = await API.callHandler(handler, {
        a: "alpha",
      })
      expect(res.statusCode).toEqual(500)
      // TODO: Make the statusMessage say "Internal Server Error" (NextJS bug)
      // expect(res.statusMessage).toEqual("Internal Server Error")
      expect(response).toContain("WTF")
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
      const [response] = await API.callHandler(handler, {})
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
      const method = API.withJSendError(async (props) => {
        throw new Error("WTF")
      })
      const response = await API.callMethod(method, {})
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
      const response = await API.callMethod(method, { name: "John Doe" })
      expect(response).toEqual({ greeting: "Hello John Doe" })
    })

    it("should throw on a bad prop", async () => {
      const method = API.withProps(Props, async (props) => {
        return { greeting: `Hello ${props.name}` }
      })
      await expect(
        // @ts-ignore
        API.callMethod(method, {})
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
      const [result] = await API.callHandler(handler, { name: "John Doe" })
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

    it("should handle a thrown error as jsend", async () => {
      const [result] = await API.callHandler(handler, {})
      expect(result).toEqual({
        status: "error",
        message: expect.stringContaining(
          `Error validating API method props: At path: name`
        ),
      })
    })
  })

  describe("withCorsHandler", () => {
    it("should add CORS headers", async () => {
      const handler = API.withCorsHandler(
        API.withHandler(async () => {
          return { message: "Hello World" }
        })
      )
      const [, , res] = await API.callHandler(handler, {})
      const allowOrigin = res.getHeader("access-control-allow-origin")
      expect(allowOrigin).toEqual("*")
    })
  })
})
