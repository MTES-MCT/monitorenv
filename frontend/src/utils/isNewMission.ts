export function isNewMission(id: string | number | undefined) {
  return id?.toString().includes('new') ?? false
}
