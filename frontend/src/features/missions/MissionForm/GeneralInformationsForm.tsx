import {
  FieldError,
  FormikCheckbox,
  FormikDatePicker,
  FormikMultiCheckbox,
  FormikTextInput,
  FormikTextarea,
  MultiRadio
} from '@mtes-mct/monitor-ui'
import { FieldArray, useField, useFormikContext } from 'formik'
import { matchPath } from 'react-router'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { InteractionListener } from '../../../domain/entities/map/constants'
import {
  Mission,
  MissionSourceEnum,
  getMissionStatus,
  hasMissionOrderLabels,
  missionStatusLabels,
  missionTypeEnum
} from '../../../domain/entities/missions'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MissionSourceTag } from '../../../ui/MissionSourceTag'
import { MissionStatusTag, StatusTag } from '../../../ui/MissionStatusTag'
import { useNewWindow } from '../../../ui/NewWindow'
import { MultiZonePicker } from '../MultiZonePicker'
import { ControlUnitsForm } from './ControlUnitsForm'

export function GeneralInformationsForm() {
  const { newWindowContainerRef } = useNewWindow()

  const { isClosedMission } = useAppSelector(state => state.missionState)

  const [isClosedField] = useField<boolean>('isClosed')
  const [hasMissionOrderField] = useField<boolean>('hasMissionOrder')
  const [missionSourceField] = useField<MissionSourceEnum>('missionSource')
  const { values } = useFormikContext<Mission>()
  const missionTypeOptions = Object.entries(missionTypeEnum).map(([key, val]) => ({ label: val.libelle, value: key }))

  const hasMissionOrderOptions = Object.values(hasMissionOrderLabels)

  const [, startDateMeta] = useField('startDateTimeUtc')
  const [, endDateMeta] = useField('endDateTimeUtc')

  const { sideWindow } = useAppSelector(state => state)
  const isCreateMissionPage = !!matchPath(
    {
      end: true,
      path: sideWindowPaths.MISSION_NEW
    },
    sideWindow.currentPath
  )

  const title = isCreateMissionPage
    ? 'Nouvelle mission'
    : `Mission ${
        values.missionTypes && values.missionTypes.map(missionType => missionTypeEnum[missionType].libelle).join(' / ')
      } – ${values.controlUnits.map(controlUnit => controlUnit.name?.replace('(historique)', '')).join(', ')}`

  const getStatus = () => {
    if (isClosedMission) {
      return <StatusTag bgColor={COLORS.opal}>{missionStatusLabels.CLOSED.libelle}</StatusTag>
    }

    return <MissionStatusTag status={getMissionStatus({ ...values, isClosed: false })} />
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <Title>{title}</Title>
        {!isCreateMissionPage && (
          <StyledTagsContainer>
            <MissionSourceTag source={missionSourceField?.value} />
            {getStatus()}
          </StyledTagsContainer>
        )}
      </StyledHeader>
      <StyledFormWrapper>
        <div>
          <StyledDatePickerContainer>
            <FormikDatePicker
              baseContainer={newWindowContainerRef.current}
              data-cy="mission-start-date-time"
              isCompact
              isErrorMessageHidden
              isStringDate
              label="Début de mission (UTC)"
              name="startDateTimeUtc"
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
          {startDateMeta.error && <FieldError>{startDateMeta.error}</FieldError>}
          {endDateMeta.error && <FieldError>{endDateMeta.error}</FieldError>}
        </div>

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
            render={props => <ControlUnitsForm readOnly={isClosedField.value} {...props} />}
            validateOnChange={false}
          />
        </StyledUnitsContainer>

        <MultiZonePicker
          addButtonLabel="Ajouter une zone de mission"
          interactionListener={InteractionListener.MISSION_ZONE}
          label="Localisations :"
          name="geom"
          readOnly={isClosedField.value}
        />

        <StyledObservationsContainer>
          <FormikTextarea label="CACEM : orientations, observations" name="observationsCacem" />
          <FormikTextarea label="CNSP : orientations, observations" name="observationsCnsp" />
          <StyledAuthorContainer>
            <FormikTextInput isErrorMessageHidden label="Ouvert par" name="openBy" />
            <FormikTextInput isErrorMessageHidden label="Clôturé par" name="closedBy" />
          </StyledAuthorContainer>
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
  max-width: 70%;
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
