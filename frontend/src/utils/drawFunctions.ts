import { OLGeometryType, InteractionType } from 'domain/entities/map/constants'
import { Modify } from 'ol/interaction'
import Draw, { createBox, createRegularPolygon, type GeometryFunction } from 'ol/interaction/Draw'

export function getOLTypeAndGeometryFunctionFromInteractionType(interactionType: InteractionType | null): {
  geometryFunction: GeometryFunction | undefined
  geometryType: OLGeometryType
} {
  switch (interactionType) {
    case InteractionType.SQUARE:
      return {
        geometryFunction: createBox(),
        geometryType: OLGeometryType.CIRCLE
      }
    case InteractionType.CIRCLE:
      return {
        geometryFunction: createRegularPolygon(),
        geometryType: OLGeometryType.CIRCLE
      }
    case InteractionType.POLYGON:
    default:
      return {
        geometryFunction: undefined,
        geometryType: OLGeometryType.POLYGON
      }
  }
}

export function resetModifyInteractions(map) {
  map.getInteractions().forEach(interaction => {
    if (interaction instanceof Modify) {
      interaction.setActive(false)
    }
  })
}

export function resetDrawInteractions(map) {
  map.getInteractions().forEach(interaction => {
    if (interaction instanceof Draw) {
      interaction.setActive(false)
    }
  })
}
