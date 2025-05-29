import { getColorWithAlpha, stringToColorInGroup } from '@utils/utils'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'

export function getLocalizedAreaColorWithAlpha(group: string = '') {
  return getColorWithAlpha(stringToColorInGroup(group, group, MonitorEnvLayers.LOCALIZED_AREAS), 0.6)
}
