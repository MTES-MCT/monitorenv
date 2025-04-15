import { Accent, Button, Icon, THEME } from '@mtes-mct/monitor-ui'
import { ReportingTargetTypeEnum, TargetTypeEnum } from 'domain/entities/targetType'
import { VehicleTypeEnum } from 'domain/entities/vehicleType'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import {
  ActionTypeEnum,
  type Mission,
  type NewInfraction,
  type NewMission
} from '../../../../../../../domain/entities/missions'
import {
  ControlStatusEnum,
  ReportingTypeEnum,
  type ReportingForTimeline
} from '../../../../../../../domain/entities/reporting'
import { getDateAsLocalizedStringCompact } from '../../../../../../../utils/getDateAsLocalizedString'
import { StatusActionTag } from '../../../../../../Reportings/components/StatusActionTag'
import { getFormattedReportingId, getTargetDetailsSubText, getTargetName } from '../../../../../../Reportings/utils'
import { actionFactory, infractionFactory } from '../../../../../Missions.helpers'
import { Accented, ControlContainer, ReportingDate, SummaryContent, SummaryContentFirstPart } from '../style'

export function ReportingCard({
  action,
  setCurrentActionId
}: {
  action: ReportingForTimeline
  setCurrentActionId: (actionId: string) => void
}) {
  const { setFieldValue, values } = useFormikContext<Partial<Mission | NewMission>>()

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

  const addAttachedControl = e => {
    e.stopPropagation()
    let newInfractions: Array<NewInfraction> = []

    if (
      action.reportType === ReportingTypeEnum.INFRACTION_SUSPICION &&
      action.targetType !== ReportingTargetTypeEnum.OTHER &&
      action.targetDetails &&
      action.targetDetails.length > 0
    ) {
      newInfractions = action.targetDetails.map(target => {
        switch (action.targetType) {
          case ReportingTargetTypeEnum.VEHICLE:
            return infractionFactory({
              controlledPersonIdentity: target?.operatorName,
              registrationNumber: target?.externalReferenceNumber,
              ...(action.vehicleType === VehicleTypeEnum.VESSEL && {
                imo: target?.imo,
                mmsi: target?.mmsi,
                vesselName: target?.vesselName,
                vesselSize: target?.size,
                vesselType: target?.vesselType
              })
            })

          case ReportingTargetTypeEnum.COMPANY:
            return infractionFactory({
              companyName: target?.operatorName,
              controlledPersonIdentity: target?.vesselName
            })

          default:
            return infractionFactory({
              controlledPersonIdentity: target?.operatorName
            })
        }
      })
    }

    const newControl = actionFactory({
      actionNumberOfControls: 1,
      actionTargetType: action.targetType as unknown as TargetTypeEnum,
      actionType: ActionTypeEnum.CONTROL,
      reportingIds: [Number(action.id)],
      vehicleType: action.vehicleType,
      ...(action.geom &&
        action.geom.type === 'MultiPoint' && {
          geom: action.geom
        }),
      ...(action.theme && {
        themes: [action.theme]
      }),
      tags: action.tags,
      ...(newInfractions.length > 0 && {
        infractions: [...newInfractions]
      })
    })

    setFieldValue('envActions', [newControl, ...(values?.envActions ?? [])])
    setCurrentActionId(newControl.id)

    const reportingToUpdateIndex = values?.attachedReportings
      ? values?.attachedReportings?.findIndex(reporting => Number(reporting.id) === Number(action.id))
      : -1
    if (reportingToUpdateIndex !== -1) {
      setFieldValue(`attachedReportings[${reportingToUpdateIndex}].attachedEnvActionId`, newControl.id)
    }
  }

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

  return (
    <>
      <Icon.Report color={THEME.color.charcoal} size={20} />
      <SummaryContent>
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

          {(!action.attachedEnvActionId || controlStatus === ControlStatusEnum.CONTROL_TO_BE_DONE) && (
            <Button accent={Accent.SECONDARY} Icon={Icon.ControlUnit} onClick={addAttachedControl}>
              Ajouter un contrôle
            </Button>
          )}
        </ControlContainer>
      </SummaryContent>
    </>
  )
}
