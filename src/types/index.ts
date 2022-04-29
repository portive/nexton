export * from "./json-date"
export * from "./side-types"
export * from "./api-types"

/**
 * Defines a function type that takes a primary input and returns some sort of
 * primary output. It also allows for an arbitrary number of additional
 * arguments in the function to pass in other values. For example, an API
 * function would have a req and res, a getServerSideProps function has a
 * GetServerSidePropsContext.
 */
export type GenericMethod<
  I extends Record<string, unknown>,
  Args extends unknown[],
  O extends Record<string, unknown>
> = (input: I, ...args: Args) => Promise<O>
