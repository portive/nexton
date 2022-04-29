import * as s from "superstruct"

/**
 * Executes SuperStruct's `create` method but when there is an error, instead
 * of showing the not very meaningful StructErrror, we provide a more
 * meaningful error.
 */
export function createWithScopedErrors<T, S>(
  value: unknown,
  struct: s.Struct<T, S>,
  rename: string // e.g. "Error validating API method props"
) {
  try {
    return s.create(value, struct)
  } catch (e) {
    if (e instanceof s.StructError) {
      /**
       * We modify `e.message` because it's easy to access during unit testing
       * and also viewable. The Error retains its name which is `StructError`
       */
      e.message = `${rename}: ${e.message}`
    }
    throw e
  }
}
