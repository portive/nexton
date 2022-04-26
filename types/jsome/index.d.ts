declare module "jsome" {
  const jsome: {
    (value: unknown): void
    getColoredString: (value: unknown) => string
  }
  export default jsome
  // export default {
  //   getColoredString: (value: unknown) => void
  // } & (function jsome(value: unknown): void)
  // export default function jsome(value: unknown): void
  // type JSome = (value: unknown) => void
  // type getColoredString = (value: unknown) => void
  // type Merged = Jsome & { getColoredString }
  // export default Merged
}
