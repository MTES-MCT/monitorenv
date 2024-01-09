function generateQueryStringPart(key: string, value: boolean | string | string[] | undefined): string | undefined {
  if (value === undefined || (typeof value !== 'boolean' && value.length === 0)) {
    return undefined
  }

  const normalizedValue = Array.isArray(value) ? value.join(',') : value

  return `${key}=${encodeURIComponent(normalizedValue)}`
}

export function getQueryString(
  basePath: string,
  params?: Record<string, boolean | string | string[] | undefined> | void
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
