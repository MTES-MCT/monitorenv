import {
  CheckboxWrapper,
  CriticalCheckbox,
  PeriodCircle
} from '@features/VigilanceArea/components/VigilanceAreaForm/Periods/Periods'
import { PublishedVigilanceAreaPeriodSchema } from '@features/VigilanceArea/components/VigilanceAreaForm/Schema'
import { ValidateButton } from '@features/VigilanceArea/components/VigilanceAreaForm/style'
import { VigilanceArea } from '@features/VigilanceArea/types'
import {
  Accent,
  Button,
  type DateAsStringRange,
  DatePicker,
  DateRangePicker,
  getOptionsFromLabelledEnum,
  Icon,
  IconButton,
  Label,
  NumberInput,
  Select
} from '@mtes-mct/monitor-ui'
import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'
import { omit } from 'lodash'
import { useState } from 'react'
import styled from 'styled-components'

import type { FormikErrors } from 'formik'

type PeriodProps = {
  error: FormikErrors<VigilanceArea.VigilanceAreaPeriod> | undefined
  index: number
  initialPeriod: VigilanceArea.VigilanceAreaPeriod
  onValidate: (vigilanceAreaSource: VigilanceArea.VigilanceAreaPeriod) => void
  remove: (index: number) => void
}

export function Period({ error, index, initialPeriod, onValidate, remove }: PeriodProps) {
  const frequencyOptions = getOptionsFromLabelledEnum(VigilanceArea.FrequencyLabel)
  const endingConditionOptions = getOptionsFromLabelledEnum(VigilanceArea.EndingConditionLabel)
  const isNewlyCreatedPeriod = Object.values(
    omit(initialPeriod, ['isCritical', 'id', 'frequency', 'endingCondition'])
  ).every(value => value === undefined || value === false)
  const [isEditing, setIsEditing] = useState(isNewlyCreatedPeriod)
  const [editedPeriod, setEditedPeriod] = useState(initialPeriod)
  const isValid = (value: VigilanceArea.VigilanceAreaPeriod) => PublishedVigilanceAreaPeriodSchema.isValidSync(value)
  const cancel = () => {
    if (isNewlyCreatedPeriod) {
      remove(index)
    } else {
      setEditedPeriod(initialPeriod)
      setIsEditing(false)
    }
  }

  const validate = () => {
    setIsEditing(false)
    onValidate(editedPeriod)
  }

  const setPeriod = (period: DateAsStringRange | undefined) => {
    setEditedPeriod(prevState => ({
      ...prevState,
      endDatePeriod: period ? period[1] : undefined,
      startDatePeriod: period ? period[0] : undefined
    }))
  }

  const setIsCritical = (isChecked: boolean | undefined) => {
    setEditedPeriod({ ...editedPeriod, isCritical: isChecked ?? false })
  }

  const setEndingCondition = (nextEndingCondition: string | undefined) => {
    setEditedPeriod({ ...editedPeriod, endingCondition: nextEndingCondition as VigilanceArea.EndingCondition })
  }

  const setEndingOccurencesNumber = (nextEndingOccurrencesNumber: number | undefined) => {
    setEditedPeriod({ ...editedPeriod, endingOccurrencesNumber: nextEndingOccurrencesNumber })
  }

  const setEndingOccurenceDate = (nextEndingOccurrenceDate: string | undefined) => {
    setEditedPeriod({ ...editedPeriod, endingOccurrenceDate: nextEndingOccurrenceDate })
  }

  const setFrequency = (nextFrequency: string | undefined) => {
    let nextPeriod: VigilanceArea.VigilanceAreaPeriod = {
      ...editedPeriod,
      frequency: nextFrequency as VigilanceArea.Frequency
    }
    if (nextFrequency === VigilanceArea.Frequency.NONE) {
      nextPeriod = {
        ...nextPeriod,
        endingCondition: undefined,
        endingOccurrenceDate: undefined,
        endingOccurrencesNumber: undefined
      }
    }
    setEditedPeriod(nextPeriod)
  }

  return isEditing ? (
    <Wrapper $isCritical={editedPeriod.isCritical}>
      <DateWrapper>
        <DateRangePicker
          defaultValue={
            editedPeriod.startDatePeriod && editedPeriod.endDatePeriod
              ? [new Date(editedPeriod.startDatePeriod), new Date(editedPeriod.endDatePeriod)]
              : undefined
          }
          disabled={editedPeriod.isAtAllTimes}
          error={error?.startDatePeriod || error?.endDatePeriod}
          hasSingleCalendar
          isCompact
          isErrorMessageHidden
          isLight
          isRequired
          isStringDate
          isUndefinedWhenDisabled
          label={editedPeriod.isCritical ? 'Période critique' : 'Période de vigilance'}
          name={`periods[${index}].period`}
          onChange={setPeriod}
        />
        <CheckboxWrapper>
          <PeriodCircle $isCritical />
          <CriticalCheckbox
            checked={editedPeriod.isCritical}
            isLight
            label="Critique"
            name={`periods[${index}].isCritical`}
            onChange={setIsCritical}
          />
        </CheckboxWrapper>
      </DateWrapper>
      <>
        <Select
          disabled={editedPeriod.isAtAllTimes}
          error={error?.frequency}
          isErrorMessageHidden
          isLight
          isRequired
          isUndefinedWhenDisabled
          label="Récurrence"
          name={`periods[${index}].frequency`}
          onChange={setFrequency}
          options={frequencyOptions}
          value={editedPeriod.frequency}
        />

        {editedPeriod.frequency && editedPeriod.frequency !== VigilanceArea.Frequency.NONE && (
          <FrequencyContainer>
            <Select
              data-cy={`vigilance-area-${index}-ending-condition`}
              disabled={editedPeriod.isAtAllTimes}
              isErrorMessageHidden
              isLight
              isRequired
              isUndefinedWhenDisabled
              label="Fin récurrence"
              name={`periods[${index}].endingCondition`}
              onChange={setEndingCondition}
              options={endingConditionOptions}
              style={{ width: '180px' }}
              value={editedPeriod.endingCondition}
            />
            {editedPeriod.endingCondition === VigilanceArea.EndingCondition.OCCURENCES_NUMBER && (
              <NumberInput
                data-cy={`vigilance-area-${index}-ending-occurence-number`}
                disabled={editedPeriod.isAtAllTimes}
                isErrorMessageHidden
                isLabelHidden
                isLight
                isRequired
                isUndefinedWhenDisabled
                label="Nombre de fois"
                name="endingOccurrencesNumber"
                onChange={setEndingOccurencesNumber}
                style={{ width: '115px' }}
                value={editedPeriod.endingOccurrencesNumber}
              />
            )}
            {editedPeriod.endingCondition === VigilanceArea.EndingCondition.END_DATE && (
              <StyledDatePicker
                data-cy={`vigilance-area-${index}-ending-occurence-date`}
                defaultValue={editedPeriod.endingOccurrenceDate}
                disabled={editedPeriod.isAtAllTimes}
                isErrorMessageHidden
                isLabelHidden
                isLight
                isRequired
                isStringDate
                isUndefinedWhenDisabled
                label="Date de fin de récurrence"
                name="endingOccurrenceDate"
                onChange={setEndingOccurenceDate}
              />
            )}
          </FrequencyContainer>
        )}
      </>
      <Buttons>
        <Button accent={Accent.SECONDARY} onClick={cancel}>
          Annuler
        </Button>
        <ValidateButton disabled={!isValid(editedPeriod)} onClick={validate} type="submit">
          Valider
        </ValidateButton>
      </Buttons>
    </Wrapper>
  ) : (
    <PanelWrapper $isCritical={editedPeriod.isCritical}>
      <div>
        <Label>{editedPeriod.isCritical ? 'Période critique' : 'Période de vigilance'}</Label>
        <span>
          <Medium>{getDateAsLocalizedStringVeryCompact(initialPeriod.startDatePeriod, true)}</Medium> au{' '}
          <Medium>{getDateAsLocalizedStringVeryCompact(initialPeriod.endDatePeriod, true)}</Medium>
        </span>
      </div>
      <PanelButtons>
        <IconButton
          accent={Accent.TERTIARY}
          Icon={Icon.EditUnbordered}
          onClick={() => setIsEditing(true)}
          title="Editer la période de la zone de vigilance"
        />
        <IconButton
          accent={Accent.TERTIARY}
          Icon={Icon.Delete}
          onClick={() => remove(index)}
          title="Supprimer la période de la zone de vigilance"
        />
      </PanelButtons>
    </PanelWrapper>
  )
}

const Wrapper = styled.div<{ $isCritical: boolean | undefined }>`
  background-color: ${$p => ($p.$isCritical ? $p.theme.color.maximumRed15 : $p.theme.color.gainsboro)};
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const PanelWrapper = styled(Wrapper)`
  flex: 1;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
`

const PanelButtons = styled.div`
  display: flex;
  margin: auto 0;
`

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
`

const DateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 16px;
`

const Medium = styled.span`
  font-weight: 500;
`

const FrequencyContainer = styled.div`
  align-items: end;
  display: flex;
  flex-direction: row;
  gap: 8px;
`
const StyledDatePicker = styled(DatePicker)`
  > .Element-Fieldset__InnerBox {
    > .Field-DatePicker__CalendarPicker {
      > .rs-picker-popup {
        left: -130px !important;
      }
    }
  }
`
