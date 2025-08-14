import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { ReportingTargetTypeEnum, TargetTypeEnum } from 'domain/entities/targetType'
import { VehicleTypeEnum } from 'domain/entities/vehicleType'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import {
  ActionTypeEnum,
  type Mission,
  type NewInfraction,
  type NewMission
} from '../../../../../../../domain/entities/missions'
import {
  ControlStatusEnum,
  type ReportingForTimeline,
  ReportingTypeEnum
} from '../../../../../../../domain/entities/reporting'
import { actionFactory, infractionFactory } from '../../../../../Missions.helpers'

export function AddControlToReportingButton({
  action,
  setCurrentActionId
}: {
  action: ReportingForTimeline
  setCurrentActionId: (actionId: string) => void
}) {
  const { setFieldValue, values } = useFormikContext<Partial<Mission | NewMission>>()

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
      {(!action.attachedEnvActionId || controlStatus === ControlStatusEnum.CONTROL_TO_BE_DONE) && (
        <StyledButton accent={Accent.SECONDARY} Icon={Icon.ControlUnit} onClick={addAttachedControl}>
          Ajouter un contrôle
        </StyledButton>
      )}
    </>
  )
}

const StyledButton = styled(Button)`
  position: absolute;
  bottom: 16px;
  right: 16px;
`
