export function getIdTyped(id: string | undefined) {
  if (!id) {
    return undefined
  }

  return id.includes('new-') ? id : Number(id)
}
