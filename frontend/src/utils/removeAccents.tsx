export function removeAccents(str: string | undefined): string | undefined {
  return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
