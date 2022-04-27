import chalk from "chalk"
import jsome from "jsome"
import { logger } from "../logger"

export function request(id: number, props: unknown) {
  const lines: string[] = []
  lines.push(chalk.hex("32cd32")(`== Request (${id}) ==`))
  lines.push(jsome.getColoredString(props))
  logger.log(lines.join("\n"))
}

export function response(id: number, diff: number, response: unknown) {
  const lines: string[] = []
  lines.push(chalk.hex("32cd32")(`== Response (${id}) ${diff}ms ==`))
  lines.push(jsome.getColoredString(response))
  logger.log(lines.join("\n"))
}

export function error(id: number, error?: Error) {
  const lines: string[] = []
  lines.push(chalk.hex("b22222")(`== Error (${id}) ==`))
  if (error && error.stack != null) {
    error.stack.split("\n").forEach((line: string) => {
      /**
       * Dim stack lines that come from `node_modules` because they are less
       * important. We want the lines from our source code to be more
       * prominent.
       */
      if (line.includes("/node_modules/")) {
        lines.push(chalk.hex("800000")(line))
      } else {
        lines.push(chalk.red(line))
      }
    })
  }
  logger.log(lines.join("\n"))
}
