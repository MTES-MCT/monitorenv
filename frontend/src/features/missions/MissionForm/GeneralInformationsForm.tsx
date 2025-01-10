import { CompletionStatusTag } from '@features/missions/components/CompletionStatusTag'
import {
  customDayjs,
  DatePicker,
  FieldError,
  FormikCheckbox,
  FormikDatePicker,
  FormikMultiCheckbox,
  FormikTextInput,
  FormikTextarea,
  MultiRadio,
  useNewWindow,
  Message
} from '@mtes-mct/monitor-ui'
import { FieldArray, useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import { HIDDEN_ERROR } from './constants'
import { ControlUnitsForm } from './ControlUnitsForm'
import { MissionZonePicker } from './MissionZonePicker'
import { FormTitle, Separator } from './style'
import { CONTROL_PLAN_INIT, UNIQ_CONTROL_PLAN_INDEX } from '../../../domain/entities/controlPlan'
import {
  type Mission,
  MissionSourceEnum,
  getMissionStatus,
  hasMissionOrderLabels,
  missionTypeEnum,
  ActionTypeEnum,
  FrontCompletionStatus
} from '../../../domain/entities/missions'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getMissionPageRoute } from '../../../utils/routes'
import { MissionStatusTag } from '../components/MissionStatusTag'
import { isMissionNew, getMissionTitle, getNewMissionTitle } from '../utils'

export function GeneralInformationsForm({
  missionCompletion = undefined
}: {
  missionCompletion?: FrontCompletionStatus
}) {
  const { newWindowContainerRef } = useNewWindow()

  const currentPath = useAppSelector(state => state.sideWindow.currentPath)

  const { errors, setFieldValue, values } = useFormikContext<Mission>()
  const missionTypeOptions = Object.entries(missionTypeEnum).map(([key, val]) => ({ label: val.libelle, value: key }))

  const hasMissionOrderOptions = Object.values(hasMissionOrderLabels)

  const routeParams = getMissionPageRoute(currentPath)
  const missionIsNewMission = useMemo(() => isMissionNew(routeParams?.params?.id), [routeParams?.params?.id])

  const title = useMemo(
    () => (missionIsNewMission ? getNewMissionTitle(values) : getMissionTitle(values)),
    [missionIsNewMission, values]
  )

  const missionIsFromMonitorFish =
    values.missionSource === MissionSourceEnum.MONITORFISH || values.missionSource === MissionSourceEnum.POSEIDON_CNSP

  const actualYearForThemes = useMemo(() => customDayjs(values?.startDateTimeUtc).year(), [values?.startDateTimeUtc])

  const updateMissionDateTime = (date: string | undefined) => {
    if (actualYearForThemes && actualYearForThemes !== customDayjs(date).year()) {
      values?.envActions?.forEach((action, actionIndex) => {
        if (action.actionType === ActionTypeEnum.CONTROL && !action.actionStartDateTimeUtc) {
          setFieldValue(`envActions[${actionIndex}].controlPlans[${UNIQ_CONTROL_PLAN_INDEX}]`, CONTROL_PLAN_INIT)
        }
        if (
          action.actionType === ActionTypeEnum.SURVEILLANCE &&
          (!action.actionStartDateTimeUtc || (action.actionStartDateTimeUtc && action.durationMatchesMission))
        ) {
          action?.controlPlans?.forEach((_, index) => {
            setFieldValue(`envActions[${actionIndex}].controlPlans[${index}]`, CONTROL_PLAN_INIT)
          })
        }
      })
    }
    setFieldValue('startDateTimeUtc', date)
  }

  const missionStatus = useMemo(() => getMissionStatus(values), [values])

  return (
    <StyledContainer>
      <StyledHeader>
        <FormTitle>{title}</FormTitle>
      </StyledHeader>
      <Separator />

      <StyledFormWrapper>
        <DatesAndTagsContainer>
          <div>
            <StyledDatePickerContainer>
              <DatePicker
                baseContainer={newWindowContainerRef.current}
                data-cy="mission-start-date-time"
                defaultValue={values?.startDateTimeUtc || undefined}
                isCompact
                isErrorMessageHidden
                isRequired
                isStringDate
                label="Date de début (UTC)"
                name="startDateTimeUtc"
                onChange={updateMissionDateTime}
                withTime
              />

              <StyledFormikDatePicker
                baseContainer={newWindowContainerRef.current}
                data-cy="mission-end-date-time"
                isCompact
                isEndDate
                isErrorMessageHidden
                isRequired
                isStringDate
                label="Date de fin (UTC)"
                name="endDateTimeUtc"
                withTime
              />
            </StyledDatePickerContainer>
            {/* We simply want to display an error if the dates are not consistent, not if it's just a "field required" error. */}
            {errors.startDateTimeUtc && errors.startDateTimeUtc !== HIDDEN_ERROR && (
              <FieldError>{errors.startDateTimeUtc}</FieldError>
            )}
            {errors.endDateTimeUtc && errors.endDateTimeUtc !== HIDDEN_ERROR && (
              <FieldError>{errors.endDateTimeUtc}</FieldError>
            )}
          </div>
          <StyledTagsContainer>
            <MissionStatusTag status={missionStatus} />
            <CompletionStatusTag completion={missionCompletion} />
          </StyledTagsContainer>
        </DatesAndTagsContainer>

        <div>
          <StyledMissionType>
            <FormikMultiCheckbox
              data-cy="mission-types"
              isErrorMessageHidden
              isInline
              isRequired
              label="Type de mission"
              name="missionTypes"
              options={missionTypeOptions}
            />

            {missionIsFromMonitorFish && <FormikCheckbox disabled label="Mission sous JDP" name="isUnderJdp" />}
          </StyledMissionType>
        </div>
        {missionIsFromMonitorFish && (
          <MultiRadio
            disabled
            isInline
            label="Ordre de mission"
            name="hasMissionOrder"
            options={hasMissionOrderOptions}
            value={values.hasMissionOrder}
          />
        )}

        <StyledUnitsContainer>
          <FieldArray
            name="controlUnits"
            /* eslint-disable-next-line react/jsx-props-no-spreading */
            render={props => <ControlUnitsForm {...props} />}
          />
        </StyledUnitsContainer>

        <div>
          <MissionZonePicker />
          {values.isGeometryComputedFromControls && (
            <StyledMessage data-cy="mission-zone-computed-from-action" withoutIcon>
              Actuellement, la zone de mission est <b>automatiquement calculée</b> selon le point ou la zone de la
              dernière action rapportée par l’unité.
            </StyledMessage>
          )}
        </div>

        <StyledObservationsContainer>
          <FormikTextarea isErrorMessageHidden label="CACEM : orientations, observations" name="observationsCacem" />
          <FormikTextarea isErrorMessageHidden label="CNSP : orientations, observations" name="observationsCnsp" />
          <StyledAuthorContainer>
            <FormikTextInput isErrorMessageHidden label="Ouvert par" name="openBy" />
            <FormikTextInput isErrorMessageHidden label="Complété par" name="completedBy" />
          </StyledAuthorContainer>
          {/* We simply want to display an error if the fields are not consistent, not if it's just a "field required" error. */}
          {errors.openBy && errors.openBy !== HIDDEN_ERROR && <FieldError>{errors.openBy}</FieldError>}
          {errors.completedBy && errors.completedBy !== HIDDEN_ERROR && <FieldError>{errors.completedBy}</FieldError>}
        </StyledObservationsContainer>
      </StyledFormWrapper>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
`
const StyledFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  gap: 24px;
`

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: space-between;
  padding-top: 12px;
`
const StyledTagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 8px;
  > span {
    align-self: end;
  }
`
const DatesAndTagsContainer = styled.div`
  align-items: start;
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: space-between;
`

const StyledDatePickerContainer = styled.div`
  display: flex;
  gap: 16px;
`
const StyledFormikDatePicker = styled(FormikDatePicker)`
  p {
    max-width: 200px;
  }
`

const StyledMissionType = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: 48px;
`

const StyledUnitsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledMessage = styled(Message)`
  margin-top: 8px;
  > div {
    display: inline;
  }
`

const StyledObservationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const StyledAuthorContainer = styled.div`
  display: flex;
  gap: 16px;
  .Field-TextInput {
    width: 120px;
  }
`
