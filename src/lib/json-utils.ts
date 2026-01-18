export type JsonValidator<T> = (value: unknown) => value is T

export const safeJsonParse = <T>(
  value: string | null,
  validator?: JsonValidator<T>
): T | null => {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as unknown
    if (validator && !validator(parsed)) return null
    return parsed as T
  } catch {
    return null
  }
}

export const safeJsonStringify = (value: unknown): string | null => {
  if (value === undefined || value === null) return null
  try {
    return JSON.stringify(value)
  } catch {
    return null
  }
}
