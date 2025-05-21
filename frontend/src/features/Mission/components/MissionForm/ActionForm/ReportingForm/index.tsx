import { FormContent } from '@features/Reportings/components/ReportingReadOnly/FormContent'
import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import { ActionTypeEnum, type Mission, type NewMission } from '../../../../../../domain/entities/missions'
import { useAppDispatch } from '../../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../../hooks/useAppSelector'
import { getFormattedReportingId } from '../../../../../Reportings/utils'
import { attachReportingToMissionSliceActions } from '../../AttachReporting/slice'
import { FormTitle } from '../../style'

export function ReportingForm({
  reportingActionIndex,
  setCurrentActionId
}: {
  reportingActionIndex: number
  setCurrentActionId: (actionId: string | undefined) => void
}) {
  const dispatch = useAppDispatch()
  const { setFieldValue, values } = useFormikContext<Partial<Mission | NewMission>>()

  const reporting = values?.attachedReportings?.[reportingActionIndex]

  const attachedReportings = useAppSelector(state => state.attachReportingToMission.attachedReportings)

  if (!reporting) {
    return null
  }

  const unattachReporting = () => {
    const reportings = [...attachedReportings]
    const reportingToDeleteIndex = reportings.findIndex(r => r.id === reporting.id)
    reportings.splice(reportingToDeleteIndex, 1)
    dispatch(attachReportingToMissionSliceActions.setAttachedReportings(reportings))

    const envActionsToUpdate = values.envActions?.map(action => {
      if (
        (action.actionType === ActionTypeEnum.CONTROL || action.actionType === ActionTypeEnum.SURVEILLANCE) &&
        action.reportingIds.map(id => String(id)).includes(String(reporting.id))
      ) {
        return { ...action, reportingIds: action.reportingIds.filter(id => id !== reporting.id) }
      }

      return action
    })
    setFieldValue('envActions', envActionsToUpdate)
    setFieldValue('detachedReportingIds', [...(values.detachedReportingIds ?? []), reporting.id])
    setCurrentActionId(undefined)
  }

  return (
    <>
      <Header>
        <FormTitle>{`Signalement ${getFormattedReportingId(reporting.reportingId)}`}</FormTitle>
        <Button
          accent={Accent.SECONDARY}
          disabled={reporting.isArchived}
          Icon={Icon.Unlink}
          onClick={unattachReporting}
        >
          Détacher de la mission
        </Button>
      </Header>
      <FormContent reporting={reporting} />
    </>
  )
}

const Header = styled.div`
  padding-bottom: 32px;
  display: flex;
  justify-content: space-between;
`
