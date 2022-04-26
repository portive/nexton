import chalk from "chalk"
import jsome from "jsome"

let buffer: string[] = []

let logEnabled = true
let recordEnabled = false

function log(s: string) {
  if (logEnabled) console.log(s)
  if (recordEnabled) buffer.push(s)
}

export const debug = {
  enable() {
    logEnabled = true
  },
  disable() {
    logEnabled = false
  },
  record() {
    recordEnabled = true
  },
  stop() {
    recordEnabled = false
  },
  play(): string[] {
    const oldBuffer = buffer
    buffer = []
    return oldBuffer
  },
  request(id: number, props: unknown) {
    const lines: string[] = []
    lines.push(chalk.hex("32cd32")(`== Request (${id}) ==`))
    lines.push(jsome.getColoredString(props))
    log(lines.join("\n"))
  },
  response(id: number, diff: number, response: unknown) {
    const lines: string[] = []
    lines.push(chalk.hex("32cd32")(`== Response (${id}) ${diff}ms ==`))
    lines.push(jsome.getColoredString(response))
    log(lines.join("\n"))
  },
  error(id: number, error?: Error) {
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
    log(lines.join("\n"))
  },
}
