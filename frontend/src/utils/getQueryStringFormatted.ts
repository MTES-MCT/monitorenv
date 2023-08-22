function generateQueryStringPart(key: string, value: string | string[] | undefined): string | undefined {
  if (!value || value.length === 0) {
    return undefined
  }

  const normalizedValue = Array.isArray(value) ? value.join(',') : value

  return `${key}=${encodeURIComponent(normalizedValue)}`
}

export function getQueryString(
  basePath: string,
  params?: Record<string, string | string[] | undefined> | void
): string {
  if (!params) {
    return `${basePath}`
  }
  const queryString = Object.entries(params)
    .map(([key, value]) => generateQueryStringPart(key, value))
    .filter(Boolean)
    .join('&')

  return `${basePath}?${queryString}`
}
