import type { Port } from '../../../domain/entities/port/types'

export function isPort(portData: Port.PortData): portData is Port.Port {
  return portData.id !== undefined
}
