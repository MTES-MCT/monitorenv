import type { InteractionType } from './map/constants'

export type Semaphore = {
  administration: string | undefined
  base: string | undefined
  department: string | undefined
  email: string | undefined
  facade: string | undefined
  geom: { coordinates: number[]; type: InteractionType.POINT }
  id: number
  name: string
  phoneNumber: string | undefined
  unit: string | undefined
  url: string | undefined
}
