import { ExpandedRowList, ExpandedRowValue } from '@components/Table/TableWithSelectableRows/style'
import { UNKNOWN } from '@components/Table/TableWithSelectableRows/utils'
import { ControlInfractionsTags } from '@features/Mission/components/ControlInfractionsTags'
import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'

import { TargetTypeEnum, TargetTypeLabels } from '../../../../../domain/entities/targetType'
import { vehicleTypeLabels } from '../../../../../domain/entities/vehicleType'

import type { EnvAction } from '../../../../../domain/entities/missions'

export function ControlsCell({ envActions }: { envActions: EnvAction[] }) {
  if (envActions.length === 0) {
    return UNKNOWN
  }

  return (
    <ExpandedRowList>
      {envActions
        .filter(envAction => envAction.actionType === 'CONTROL')
        .map(envAction => (
          <li>
            <ExpandedRowValue>
              {envAction.actionStartDateTimeUtc ? (
                <>Le {getDateAsLocalizedStringVeryCompact(envAction.actionStartDateTimeUtc)}`</>
              ) : (
                ''
              )}
            </ExpandedRowValue>
            <ExpandedRowValue>
              {TargetTypeLabels[envAction.actionTargetType] && envAction.actionTargetType !== TargetTypeEnum.VEHICLE
                ? TargetTypeLabels[envAction.actionTargetType]
                : '(Cible non renseignée)'}{' '}
              {envAction.vehicleType && vehicleTypeLabels[envAction.vehicleType].label
                ? `${vehicleTypeLabels[envAction.vehicleType].label} (${TargetTypeLabels[envAction.actionTargetType]})`
                : ''}
              <ul>
                {envAction.infractions.map(infraction => (
                  <li>{infraction.vesselName}</li>
                ))}
              </ul>
              <ControlInfractionsTags
                actionNumberOfControls={envAction.actionNumberOfControls}
                infractions={envAction.infractions}
              />
            </ExpandedRowValue>
          </li>
        ))}
    </ExpandedRowList>
  )
}
