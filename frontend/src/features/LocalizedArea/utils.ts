import { getColorWithAlpha, stringToColorInGroup } from '@utils/utils'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'

export function getLocalizedAreaColorWithAlpha(group: string = '', name: string = '') {
  return getColorWithAlpha(stringToColorInGroup(group, name, MonitorEnvLayers.LOCALIZED_AREAS), 0.6)
}
