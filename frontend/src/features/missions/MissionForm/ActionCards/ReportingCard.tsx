import { Accent, Button, Icon, THEME } from '@mtes-mct/monitor-ui'
import { ReportingTargetTypeEnum } from 'domain/entities/targetType'
import { VehicleTypeEnum } from 'domain/entities/vehicleType'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import { Accented, ReportingDate, SummaryContent } from './style'
import { ActionTypeEnum, VesselSizeEnum, type Mission, type NewMission } from '../../../../domain/entities/missions'
import { ControlStatusEnum, type ReportingForTimeline } from '../../../../domain/entities/reporting'
import { useGetControlPlans } from '../../../../hooks/useGetControlPlans'
import { getDateAsLocalizedStringCompact } from '../../../../utils/getDateAsLocalizedString'
import { StatusActionTag } from '../../../Reportings/components/StatusActionTag'
import { getFormattedReportingId } from '../../../Reportings/utils'
import { actionFactory, infractionFactory } from '../../Missions.helpers'

const getVesselSize = size => {
  if (!size) {
    return undefined
  }

  if (size < 12) {
    return VesselSizeEnum.LESS_THAN_12m
  }
  if (size >= 12 && size < 24) {
    return VesselSizeEnum.FROM_12_TO_24m
  }
  if (size >= 24 && size < 46) {
    return VesselSizeEnum.FROM_24_TO_46m
  }

  return VesselSizeEnum.MORE_THAN_46m
}
export function ReportingCard({
  action,
  setCurrentActionIndex
}: {
  action: ReportingForTimeline
  setCurrentActionIndex: (string) => void
}) {
  const { themes } = useGetControlPlans()
  const { setFieldValue, values } = useFormikContext<Partial<Mission | NewMission>>()

  const addAttachedControl = e => {
    e.stopPropagation()
    let newInfraction

    if (action.targetDetails && action.targetDetails.length > 0) {
      switch (action.targetType) {
        case ReportingTargetTypeEnum.VEHICLE:
          newInfraction = infractionFactory({
            controlledPersonIdentity: action.targetDetails[0]?.operatorName,
            registrationNumber: action.targetDetails[0]?.externalReferenceNumber,
            ...(action.vehicleType === VehicleTypeEnum.VESSEL && {
              vesselSize: getVesselSize(action.targetDetails[0]?.size)
            })
          })

          break
        case ReportingTargetTypeEnum.COMPANY:
          newInfraction = infractionFactory({
            companyName: action.targetDetails[0]?.operatorName,
            controlledPersonIdentity: action.targetDetails[0]?.vesselName
          })

          break

        case ReportingTargetTypeEnum.INDIVIDUAL:
          newInfraction = infractionFactory({
            controlledPersonIdentity: action.targetDetails[0]?.operatorName
          })

          break

        case ReportingTargetTypeEnum.OTHER:
        default:
          break
      }
    }

    const newControl = actionFactory({
      actionNumberOfControls: 1,
      actionTargetType: action.targetType,
      actionType: ActionTypeEnum.CONTROL,
      reportingIds: [Number(action.id)],
      vehicleType: action.vehicleType,
      ...(action.themeId && {
        controlPlans: [
          {
            subThemeIds: action.subThemeIds ?? [],
            tagIds: [],
            themeId: action.themeId
          }
        ]
      }),
      ...(newInfraction && {
        infractions: [newInfraction]
      })
    })

    setFieldValue('envActions', [newControl, ...(values?.envActions ?? [])])
    setCurrentActionIndex(newControl.id)
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
        <Accented>{`Signalement ${getFormattedReportingId(action.reportingId)} ${action.displayedSource}`}</Accented>
        <ReportingDate>{getDateAsLocalizedStringCompact(action.createdAt)}</ReportingDate>
        {action.themeId && (
          <>
            <Accented>{themes[action.themeId]?.theme}</Accented>
            {action.themeId && ' -'}{' '}
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

const ControlContainer = styled.div<{ $isEndAlign: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: ${p => (p.$isEndAlign ? 'end' : 'start')};
  padding-top: 16px;
`
