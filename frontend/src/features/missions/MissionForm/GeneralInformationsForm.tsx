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
  useNewWindow
} from '@mtes-mct/monitor-ui'
import { FieldArray, useField, useFormikContext } from 'formik'
import styled from 'styled-components'

import { ControlUnitsForm } from './ControlUnitsForm'
import { CONTROL_PLAN_INIT, UNIQ_CONTROL_PLAN_INDEX } from '../../../domain/entities/controlPlan'
import { InteractionListener } from '../../../domain/entities/map/constants'
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
import { MultiZonePicker } from '../MultiZonePicker'

export function GeneralInformationsForm() {
  const { newWindowContainerRef } = useNewWindow()
  const currentPath = useAppSelector(state => state.sideWindow.currentPath)

  const [hasMissionOrderField] = useField<boolean>('hasMissionOrder')
  const [missionSourceField] = useField<MissionSourceEnum>('missionSource')
  const { errors, setFieldValue, values } = useFormikContext<Mission>()
  const missionTypeOptions = Object.entries(missionTypeEnum).map(([key, val]) => ({ label: val.libelle, value: key }))

  const hasMissionOrderOptions = Object.values(hasMissionOrderLabels)

  const routeParams = getMissionPageRoute(currentPath)
  const missionIsNewMission = isNewMission(routeParams?.params?.id)

  const title = getMissionTitle(missionIsNewMission, values)

  const actualYearForThemes = customDayjs(values?.startDateTimeUtc).year()
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
            <MissionSourceTag source={missionSourceField?.value} />
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
              isStringDate
              label="Début de mission (UTC)"
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
              isStringDate
              label="Fin de mission (UTC)"
              name="endDateTimeUtc"
              withTime
            />
          </StyledDatePickerContainer>
          {errors.startDateTimeUtc && <FieldError>{errors.startDateTimeUtc}</FieldError>}
          {errors.endDateTimeUtc && <FieldError>{errors.endDateTimeUtc}</FieldError>}
        </div>

        <div>
          <StyledMissionType>
            <FormikMultiCheckbox
              data-cy="mission-types"
              isErrorMessageHidden
              isInline
              label="Type de mission"
              name="missionTypes"
              options={missionTypeOptions}
            />

            {(missionSourceField.value === MissionSourceEnum.MONITORFISH ||
              missionSourceField.value === MissionSourceEnum.POSEIDON_CNSP) && (
              <FormikCheckbox disabled label="Mission sous JDP" name="isUnderJdp" />
            )}
          </StyledMissionType>
          {errors.missionTypes && <FieldError>{errors.missionTypes}</FieldError>}
        </div>
        {(missionSourceField.value === MissionSourceEnum.MONITORFISH ||
          missionSourceField.value === MissionSourceEnum.POSEIDON_CNSP) && (
          <MultiRadio
            disabled
            isInline
            label="Ordre de mission"
            name="hasMissionOrder"
            options={hasMissionOrderOptions}
            value={hasMissionOrderField.value}
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

        <MultiZonePicker
          addButtonLabel="Ajouter une zone de mission"
          interactionListener={InteractionListener.MISSION_ZONE}
          label="Localisations :"
          name="geom"
        />

        <StyledObservationsContainer>
          <FormikTextarea label="CACEM : orientations, observations" name="observationsCacem" />
          <FormikTextarea label="CNSP : orientations, observations" name="observationsCnsp" />
          <StyledAuthorContainer>
            <FormikTextInput isErrorMessageHidden label="Ouvert par" name="openBy" />
            <FormikTextInput isErrorMessageHidden label="Clôturé par" name="closedBy" />
          </StyledAuthorContainer>
          {errors.openBy && <FieldError>{errors.openBy}</FieldError>}
          {errors.closedBy && <FieldError>{errors.closedBy}</FieldError>}
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
  gap: 8px;
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

const StyledObservationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const StyledAuthorContainer = styled.div`
  display: flex;
  gap: 8px;
  .Field-TextInput {
    width: 120px;
  }
`
