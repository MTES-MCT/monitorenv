/* eslint-disable react/jsx-props-no-spreading */
import { FormikMultiCheckbox, FormikDatePicker } from '@mtes-mct/monitor-ui'
import { FieldArray } from 'formik'
import { Form } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { InteractionListener } from '../../../domain/entities/map/constants'
import { missionNatureEnum, missionTypeEnum } from '../../../domain/entities/missions'
import { useNewWindow } from '../../../ui/NewWindow'
import { FormikInput } from '../../../uiMonitor/CustomFormikFields/FormikInput'
import { FormikTextarea } from '../../../uiMonitor/CustomFormikFields/FormikTextarea'
import { MultiZonePicker } from '../MultiZonePicker'
import { ControlUnitsForm } from './ControlUnitsForm'

export function GeneralInformationsForm() {
  const { newWindowContainerRef } = useNewWindow()
  const missionTypeOptions = Object.entries(missionTypeEnum).map(([key, val]) => ({ label: val.libelle, value: key }))
  const missionNatureOptions = Object.entries(missionNatureEnum).map(([key, val]) => ({
    label: val.libelle,
    value: key
  }))

  return (
    <>
      <Title>Informations générales</Title>
      <FlexFormGroup>
        <ColWrapper>
          <FormikDatePicker
            baseContainer={newWindowContainerRef.current}
            isCompact
            isStringDate
            label="Début de mission (UTC)"
            name="startDateTimeUtc"
            withTime
          />
        </ColWrapper>
        <ColWrapper>
          <FormikDatePicker
            baseContainer={newWindowContainerRef.current}
            isCompact
            isStringDate
            label="Fin de mission (UTC)"
            name="endDateTimeUtc"
            withTime
          />
        </ColWrapper>
      </FlexFormGroup>

      <Form.Group>
        <SubGroup>
          <FormikMultiCheckbox
            data-cy="mission-types"
            isInline
            label="Type de mission"
            name="missionTypes"
            options={missionTypeOptions}
          />
        </SubGroup>
        <SubGroup>
          <FormikMultiCheckbox
            data-cy="mission-nature"
            isInline
            label="Intentions principales de mission"
            name="missionNature"
            options={missionNatureOptions}
          />
        </SubGroup>
      </Form.Group>
      <Form.Group>
        <FieldArray name="controlUnits" render={props => <ControlUnitsForm {...props} />} />
      </Form.Group>

      <MultiZonePicker
        addButtonLabel="Ajouter une zone de mission"
        interactionListener={InteractionListener.MISSION_ZONE}
        label="Localisations :"
        name="geom"
      />
      <Form.Group>
        <Form.ControlLabel htmlFor="observationsCacem">CACEM : orientations, observations </Form.ControlLabel>
        <InputObservations name="observationsCacem" />
        <Form.ControlLabel htmlFor="observationsCnsp">CNSP : orientations, observations </Form.ControlLabel>
        <InputObservations name="observationsCnsp" />
        <SubGroup>
          <NarrowColumn>
            <Form.ControlLabel htmlFor="openBy">Ouvert par</Form.ControlLabel>
            <FormikInput name="openBy" size="sm" />
          </NarrowColumn>
          <NarrowColumn>
            <Form.ControlLabel htmlFor="closedBy">Clôturé par</Form.ControlLabel>
            <FormikInput name="closedBy" size="sm" />
          </NarrowColumn>
        </SubGroup>
      </Form.Group>
    </>
  )
}
const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  padding-bottom: 13px;
  color: ${COLORS.charcoal};
`
const FlexFormGroup = styled(Form.Group)`
  display: flex;
`
const ColWrapper = styled.div`
  width: 200px;
  height: 54px;
  display: inline-block;
  :not(:last-child) {
    margin-right: 16px;
  }
`

const NarrowColumn = styled.div`
  width: 120px;
  display: inline-block;
  :not(:last-child) {
    margin-right: 16px;
  }
`
const SubGroup = styled.div`
  margin-bottom: 16px;
`

const InputObservations = styled(FormikTextarea)`
  max-width: 416px;
`
