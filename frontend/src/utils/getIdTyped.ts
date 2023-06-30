export function getIdTyped(id) {
  if (!id) {
    return undefined
  }

  return id.includes('new-') ? id : Number(id)
}
