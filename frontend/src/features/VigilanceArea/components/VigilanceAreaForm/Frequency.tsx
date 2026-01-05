import { VigilanceArea } from '@features/VigilanceArea/types'
import { FormikDatePicker, FormikNumberInput, getOptionsFromLabelledEnum, Select } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

export function Frequency() {
  const { errors, setFieldValue, values } = useFormikContext<VigilanceArea.VigilanceArea>()
  const frequencyOptions = getOptionsFromLabelledEnum(VigilanceArea.FrequencyLabel)

  const endingConditionOptions = getOptionsFromLabelledEnum(VigilanceArea.EndingConditionLabel)

  const updateFrequency = (nextFrequency: string | undefined) => {
    setFieldValue('periods[0].frequency', nextFrequency)
    if (nextFrequency === VigilanceArea.Frequency.NONE) {
      setFieldValue('periods[0].endingCondition', undefined)
      setFieldValue('periods[0].endingOccurrenceDate', undefined)
      setFieldValue('periods[0].endingOccurrencesNumber', undefined)
    }
  }

  const updateEndingCondition = (nextEndingCondition: string | undefined) => {
    setFieldValue('periods[0].endingCondition', nextEndingCondition)
    if (nextEndingCondition === VigilanceArea.EndingCondition.NEVER) {
      setFieldValue('periods[0].endingOccurrenceDate', undefined)
      setFieldValue('periods[0].endingOccurrencesNumber', undefined)
    }
  }

  return (
    <>
      <Select
        disabled={values?.periods && values?.periods[0]?.isAtAllTimes}
        error={errors.periods}
        isErrorMessageHidden
        isLight
        isRequired
        isUndefinedWhenDisabled
        label="Récurrence"
        name="periods[0].frequency"
        onChange={updateFrequency}
        options={frequencyOptions}
        value={values?.periods && values.periods[0]?.frequency}
      />

      {values?.periods &&
        values.periods[0]?.frequency &&
        values.periods[0]?.frequency !== VigilanceArea.Frequency.NONE && (
          <FrequencyContainer>
            <Select
              data-cy="vigilance-area-ending-condition"
              disabled={values?.periods && values.periods[0]?.isAtAllTimes}
              isErrorMessageHidden
              isLight
              isRequired
              isUndefinedWhenDisabled
              label="Fin récurrence"
              name="periods[0].endingCondition"
              onChange={updateEndingCondition}
              options={endingConditionOptions}
              style={{ width: '180px' }}
              value={values?.periods && values.periods[0]?.endingCondition}
            />
            {values?.periods &&
              values.periods[0]?.endingCondition === VigilanceArea.EndingCondition.OCCURENCES_NUMBER && (
                <FormikNumberInput
                  data-cy="vigilance-area-ending-occurence-number"
                  disabled={values?.periods && values.periods[0]?.isAtAllTimes}
                  isErrorMessageHidden
                  isLabelHidden
                  isLight
                  isRequired
                  isUndefinedWhenDisabled
                  label="Nombre de fois"
                  name="periods[0].endingOccurrencesNumber"
                  style={{ width: '115px' }}
                />
              )}
            {values?.periods && values.periods[0]?.endingCondition === VigilanceArea.EndingCondition.END_DATE && (
              <StyledFormikDatePicker
                data-cy="vigilance-area-ending-occurence-date"
                disabled={values?.periods && values.periods[0]?.isAtAllTimes}
                isErrorMessageHidden
                isLabelHidden
                isLight
                isRequired
                isRightAligned
                isStringDate
                isUndefinedWhenDisabled
                label="Date de fin de récurrence"
                name="periods[0].endingOccurrenceDate"
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
