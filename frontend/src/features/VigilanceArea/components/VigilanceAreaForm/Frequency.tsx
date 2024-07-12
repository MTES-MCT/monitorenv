import { VigilanceArea } from '@features/VigilanceArea/types'
import { FormikDatePicker, FormikNumberInput, getOptionsFromLabelledEnum, Select } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

export function Frequency() {
  const { errors, setFieldValue, values } = useFormikContext<VigilanceArea.VigilanceArea>()
  const frequencyOptions = getOptionsFromLabelledEnum(VigilanceArea.FrequencyLabel)

  const endingConditionOptions = getOptionsFromLabelledEnum(VigilanceArea.EndingConditionLabel)

  const updateFrequency = nextFrequency => {
    setFieldValue('frequency', nextFrequency)
    if (nextFrequency === VigilanceArea.Frequency.NONE) {
      setFieldValue('endingCondition', undefined)
      setFieldValue('endingOccurrenceDate', undefined)
      setFieldValue('endingOccurrencesNumber', undefined)
    }
  }

  const updateEndingCondition = nextEndingCondition => {
    setFieldValue('endingCondition', nextEndingCondition)
    if (nextEndingCondition === VigilanceArea.EndingCondition.NEVER) {
      setFieldValue('endingOccurrenceDate', undefined)
      setFieldValue('endingOccurrencesNumber', undefined)
    }
  }

  return (
    <>
      <Select
        error={errors.frequency}
        isErrorMessageHidden
        isRequired
        label="Récurrence"
        name="frequency"
        onChange={updateFrequency}
        options={frequencyOptions}
        style={{ width: '180px' }}
        value={values.frequency}
      />

      {values.frequency && values.frequency !== VigilanceArea.Frequency.NONE && (
        <FrequencyContainer>
          <Select
            data-cy="vigilance-area-ending-condition"
            isErrorMessageHidden
            isRequired
            label="Fin récurrence"
            name="endingCondition"
            onChange={updateEndingCondition}
            options={endingConditionOptions}
            style={{ width: '180px' }}
            value={values.endingCondition}
          />
          {values.endingCondition === VigilanceArea.EndingCondition.OCCURENCES_NUMBER && (
            <FormikNumberInput
              data-cy="vigilance-area-ending-occurence-number"
              isErrorMessageHidden
              isLabelHidden
              isRequired
              label="Nombre de fois"
              name="endingOccurrencesNumber"
              style={{ width: '115px' }}
            />
          )}
          {values.endingCondition === VigilanceArea.EndingCondition.END_DATE && (
            <StyledFormikDatePicker
              data-cy="vigilance-area-ending-occurence-date"
              isErrorMessageHidden
              isLabelHidden
              isRequired
              isRightAligned
              isStringDate
              label="Date de fin de récurrence"
              name="endingOccurrenceDate"
            />
          )}
        </FrequencyContainer>
      )}
    </>
  )
}

const FrequencyContainer = styled.div`
  align-items: end;
  display: flex;
  flex-direction: row;
  gap: 8px;
`

const StyledFormikDatePicker = styled(FormikDatePicker)`
  > .Element-Fieldset__InnerBox {
    > .Field-DatePicker__CalendarPicker {
      > .rs-picker-popup {
        left: -130px !important;
      }
    }
  }
`
