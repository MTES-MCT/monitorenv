import { Icon, THEME } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import { ActionTypeEnum, type Mission, type NewMission } from '../../../../../../../domain/entities/missions'
import { ControlStatusEnum, type ReportingForTimeline } from '../../../../../../../domain/entities/reporting'
import { getDateAsLocalizedStringCompact } from '../../../../../../../utils/getDateAsLocalizedString'
import { StatusActionTag } from '../../../../../../Reportings/components/StatusActionTag'
import { getFormattedReportingId, getTargetDetailsSubText, getTargetName } from '../../../../../../Reportings/utils'
import { Accented, ControlContainer, ReportingDate, SummaryContent, SummaryContentFirstPart } from '../style'

export function ReportingCard({ action }: { action: ReportingForTimeline }) {
  const { values } = useFormikContext<Partial<Mission | NewMission>>()

  const targetText = useMemo(() => {
    const targetName = getTargetName({
      target: action.targetDetails?.[0],
      targetType: action.targetType,
      vehicleType: action.vehicleType
    })

    const targetDetails = getTargetDetailsSubText({
      target: action.targetDetails?.[0],
      targetType: action.targetType,
      vehicleType: action.vehicleType
    })

    const targetDetailsText = targetDetails ? `(${targetDetails})` : ''

    return `${targetName} ${targetDetailsText}`
  }, [action.targetDetails, action.targetType, action.vehicleType])

  const controlStatus = useMemo(() => {
    const attachedAction = values?.envActions?.find(a => a.id === action.attachedEnvActionId)

    if (action.attachedEnvActionId && attachedAction?.actionType === ActionTypeEnum.CONTROL) {
      return ControlStatusEnum.CONTROL_DONE
    }

    if (action.attachedEnvActionId && attachedAction?.actionType === ActionTypeEnum.SURVEILLANCE) {
      return ControlStatusEnum.SURVEILLANCE_DONE
    }

    return ControlStatusEnum.CONTROL_TO_BE_DONE
  }, [action.attachedEnvActionId, values?.envActions])

  const canAddAControl = !action.attachedEnvActionId || controlStatus === ControlStatusEnum.CONTROL_TO_BE_DONE

  return (
    <>
      <Icon.Report color={THEME.color.charcoal} size={20} />
      <SummaryContent style={canAddAControl ? { marginBottom: '34px' } : {}}>
        <SummaryContentFirstPart>
          <span>{`Signalement ${getFormattedReportingId(action.reportingId)}`}</span>
          <Accented>{targetText}</Accented>
          <ReportingDate>{getDateAsLocalizedStringCompact(action.createdAt)}</ReportingDate>
        </SummaryContentFirstPart>
        {action.theme && (
          <>
            <Accented>{action.theme.name}</Accented>
            {!!action.theme && ' -'}{' '}
          </>
        )}
        {action.description ?? 'Aucune description'}
        <ControlContainer $isEndAlign={!action.attachedEnvActionId}>
          {action.attachedEnvActionId && controlStatus !== ControlStatusEnum.CONTROL_TO_BE_DONE && (
            <StatusActionTag backgroundColor={THEME.color.white} controlStatus={controlStatus} />
          )}
        </ControlContainer>
      </SummaryContent>
    </>
  )
}
