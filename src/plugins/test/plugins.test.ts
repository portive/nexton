/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as s from "superstruct"
import { AssertType } from "@thesunny/assert-type"
import { AsyncReturnType } from "type-fest"
import { logger } from "../../logger"
import * as Plugins from ".."

/**
 * WORKING:
 *
 * Working on this. Moving tests from `api/test/method.test.ts` to do with
 * plugins.
 *
 * - [ ] Rewrite all the tests to be simpler here
 * - [ ] Remove the tests in `api/test/method.test.ts`
 * - [ ] Transfer these plugins for use in `getServerSideProps`
 */

describe("method", () => {
  describe("withLog", () => {
    it("should execute a handler with logging", async () => {
      const transform = Plugins.withLog(
        "Request",
        "Response",
        async (props) => {
          return { ...props, b: 1 }
        }
      )
      const logs = await logger.collect(async () => {
        const response = await transform({ a: "alpha" })
        expect(response).toEqual({ a: "alpha", b: 1 })
      })
      expect(logs.length).toEqual(2)
      expect(logs[0]).toMatch(/== Request .* ==/)
      expect(logs[0]).toMatch(/a.*alpha/)
      expect(logs[1]).toMatch(/== Response .* ==/i)
      expect(logs[1]).toMatch(/b.*1/)
    })

    it("should execute a handler with logging that throws an error", async () => {
      const transforms = Plugins.withLog("Request", "Response", async () => {
        throw new Error("WTF")
      })
      const logs = await logger.collect(async () => {
        try {
          await transforms({
            a: "alpha",
          })
        } catch (e) {
          // eat the error
        }
      })
      expect(logs[1]).toMatch(/== Error .* ==/)
      expect(logs[1]).toMatch(/Error: WTF/)
    })
  })

  describe("withDate", () => {
    it("should convert response to EJSON dates", async () => {
      const at = new Date("2000-01-01")
      const transform = Plugins.withDate(async () => {
        return { at }
      })
      const output = await transform({})
      expect(output).toEqual({ at: { $date: 946684800000 } })
    })
  })

  describe("withJSend", () => {
    it("should limit responses to JSend compatible objects", async () => {
      Plugins.withJSend(async () => {
        return { status: "success", data: { a: "alpha" } }
      })
    })

    it("should limit to dates within JSend", async () => {
      const at = new Date("2000-01-01")
      Plugins.withDate(
        Plugins.withJSend(async () => {
          return { status: "success", data: { at } }
        })
      )
    })
  })

  describe("withJsendError", () => {
    it("should turn an error into a jsend error", async () => {
      const method = Plugins.withJSendError(async () => {
        throw new Error("WTF")
      })
      const response = await method({})
      expect(response).toEqual({
        status: "error",
        message: expect.stringContaining("Error: WTF"),
      })
    })

    it("shouldn't do anything unusual if there isn't an error", async () => {
      const transform = Plugins.withJSendError(async () => {
        return { message: "Hello World" }
      })
      const response = await transform({})
      expect(response).toEqual({
        message: "Hello World",
      })
    })
  })

  describe("withProps", () => {
    const Props = s.object({ name: s.string() })

    it("should type the incoming props", async () => {
      const transform = Plugins.withProps(Props, async (props) => {
        AssertType.Equal<typeof props, { name: string }>(true)
        return { greeting: `Hello ${props.name}` }
      })
      AssertType.Equal<AsyncReturnType<typeof transform>, { greeting: string }>(
        true
      )
      const output = await transform({ name: "John Doe" })
      expect(output).toEqual({ greeting: "Hello John Doe" })
    })

    it("should throw on a bad prop", async () => {
      const transform = Plugins.withProps(Props, async (props) => {
        return { greeting: `Hello ${props.name}` }
      })
      await expect(
        // @ts-ignore
        transform({})
      ).rejects.toThrow("At path: name -- Expected a string")
    })
  })
})
