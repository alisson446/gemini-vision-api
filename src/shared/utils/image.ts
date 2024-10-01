export function extractMimeType (base64String: string) {
  const matches = base64String.match(/^data:(.+);base64,/)

  if (!matches) {
    return null
  }

  return matches[1]
}
