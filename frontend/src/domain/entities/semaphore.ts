import type { InteractionType } from './map/constants'

export type Semaphore = {
  administration: string | undefined | null
  base: string | undefined | null
  department: string | undefined | null
  email: string | undefined | null
  facade: string | undefined | null
  geom: { coordinates: number[]; type: InteractionType.POINT }
  id: number
  name: string
  phoneNumber: string | undefined | null
  unit: string | undefined | null
}
