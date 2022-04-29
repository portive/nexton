/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Web } from ".."
import { Mock } from "~/src"
import { logger } from "~/src/logger"
import * as s from "superstruct"

describe("getServerSideProps", () => {
  describe("getServerSideProps", () => {
    const Query = s.object({ name: s.string() })
    const getServerSideProps = Web.getServerSideProps(Query, async (query) => {
      return { message: `Hello ${query.name}` }
    })
    it("should call a getServerSideProps with a context", async () => {
      const chunks = await logger.record(async () => {
        const [output] = await Mock.callSideHandler(
          { name: "John Doe" },
          getServerSideProps
        )
        expect(output).toEqual({ message: "Hello John Doe" })
      })
      expect(chunks.length).toEqual(2)
    })

    it("should raise an error if the query is invalid", async () => {
      await expect(
        Mock.callSideHandler({ INVALID: "John Doe" }, getServerSideProps)
      ).rejects.toThrow("Error validating input props")
    })

    it("should convert a DateJson to JSON", async () => {
      const EmptyQuery = s.object({})
      const [output] = await Mock.callSideHandler(
        {},
        Web.getServerSideProps(EmptyQuery, async () => {
          return { at: new Date("2022-01-01") }
        })
      )
      expect(output).toEqual({ at: { $date: 1640995200000 } })
    })
  })
})
