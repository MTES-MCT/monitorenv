import type { InteractionListener, InteractionType } from '../entities/map/constants'

export type MapClickEvent = {
  ctrlKeyPressed: boolean
  feature: Object
}

export type InteractionTypeAndListener = {
  listener: InteractionListener
  type: InteractionType
}
