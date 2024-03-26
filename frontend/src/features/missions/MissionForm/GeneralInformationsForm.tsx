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
  THEME
} from '@mtes-mct/monitor-ui'
import { FieldArray, useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import { ControlUnitsForm } from './ControlUnitsForm'
import { MissionZonePicker } from './MissionZonePicker'
import { CONTROL_PLAN_INIT, UNIQ_CONTROL_PLAN_INDEX } from '../../../domain/entities/controlPlan'
import {
  type Mission,
  MissionSourceEnum,
  getMissionStatus,
  hasMissionOrderLabels,
  missionTypeEnum,
  ActionTypeEnum
} from '../../../domain/entities/missions'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MissionSourceTag } from '../../../ui/MissionSourceTag'
import { MissionStatusTag } from '../../../ui/MissionStatusTag'
import { getMissionTitle } from '../../../utils/getMissionTitle'
import { isNewMission } from '../../../utils/isNewMission'
import { getMissionPageRoute } from '../../../utils/routes'

export function GeneralInformationsForm() {
  const { newWindowContainerRef } = useNewWindow()
  const currentPath = useAppSelector(state => state.sideWindow.currentPath)

  const { errors, setFieldValue, values } = useFormikContext<Mission>()
  const missionTypeOptions = Object.entries(missionTypeEnum).map(([key, val]) => ({ label: val.libelle, value: key }))

  const hasMissionOrderOptions = Object.values(hasMissionOrderLabels)

  const routeParams = getMissionPageRoute(currentPath)
  const missionIsNewMission = useMemo(() => isNewMission(routeParams?.params?.id), [routeParams?.params?.id])

  const title = useMemo(() => getMissionTitle(missionIsNewMission, values), [missionIsNewMission, values])

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

  return (
    <StyledContainer>
      <StyledHeader>
        <Title>{title}</Title>
        {!missionIsNewMission && (
          <StyledTagsContainer>
            <MissionSourceTag source={values.missionSource} />
            <MissionStatusTag status={getMissionStatus(values)} />
          </StyledTagsContainer>
        )}
      </StyledHeader>
      <StyledFormWrapper>
        <div>
          <StyledDatePickerContainer>
            <DatePicker
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
          {errors.startDateTimeUtc && errors.startDateTimeUtc?.length > 1 && (
            <FieldError>{errors.startDateTimeUtc}</FieldError>
          )}
          {errors.endDateTimeUtc && errors.endDateTimeUtc.length > 1 && (
            <FieldError>{errors.endDateTimeUtc}</FieldError>
          )}
        </div>

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
            validateOnChange={false}
          />
        </StyledUnitsContainer>

        <div>
          <MissionZonePicker />
          {values.isGeometryComputedFromControls && (
            <ZoneComputedFromActions data-cy="mission-zone-computed-from-action">
              Actuellement, la zone de mission est <b>automatiquement calculée</b> selon le point ou la zone de la
              dernière action rapportée par l’unité.
            </ZoneComputedFromActions>
          )}
        </div>

        <StyledObservationsContainer>
          <FormikTextarea label="CACEM : orientations, observations" name="observationsCacem" />
          <FormikTextarea label="CNSP : orientations, observations" name="observationsCnsp" />
          <StyledAuthorContainer>
            <FormikTextInput isErrorMessageHidden isRequired label="Ouvert par" name="openBy" />
            <FormikTextInput isErrorMessageHidden isRequired label="Clôturé par" name="closedBy" />
          </StyledAuthorContainer>
          {/* We simply want to display an error if the fields are not consistent, not if it's just a "field required" error. */}
          {errors.openBy && errors.openBy.length > 1 && <FieldError>{errors.openBy}</FieldError>}
          {errors.closedBy && errors.closedBy.length > 1 && <FieldError>{errors.closedBy}</FieldError>}
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
  max-width: 484px;
  gap: 24px;
`

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  padding-bottom: 8px;
  color: ${p => p.theme.color.charcoal};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 60%;
`
const StyledTagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const ZoneComputedFromActions = styled.div`
  margin-top: 8px;
  color: ${THEME.color.blueYonder};
  background: ${THEME.color.blueYonder25};
  padding: 16px;
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
