/**
 * Same as JSON from `type-fest` but with dates
 *
 * https://github.com/sindresorhus/type-fest/blob/main/source/basic.d.ts
 */

export type JsonDateObject = { [Key in string]?: JsonDateValue }
export type JsonDateArray = JsonDateValue[]
export type JsonDatePrimitive = string | number | boolean | null | Date
export type JsonDateValue = JsonDatePrimitive | JsonDateObject | JsonDateArray
