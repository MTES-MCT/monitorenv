import { VigilanceArea } from '@features/VigilanceArea/types'
import { FormikDatePicker, FormikNumberInput, FormikSelect, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

export function Frequency() {
  const { values } = useFormikContext<VigilanceArea.VigilanceArea>()
  const frequencyOptions = getOptionsFromLabelledEnum(VigilanceArea.FrequencyLabel)

  const endingConditionOptions = getOptionsFromLabelledEnum(VigilanceArea.EndingConditionLabel)

  return (
    <>
      <FormikSelect
        isErrorMessageHidden
        isRequired
        label="Récurrence"
        name="frequency"
        options={frequencyOptions}
        style={{ width: '180px' }}
      />

      {values.frequency && values.frequency !== VigilanceArea.Frequency.NONE && (
        <FrequencyContainer>
          <FormikSelect
            isErrorMessageHidden
            isRequired
            label="Fin récurrence"
            name="endingCondition"
            options={endingConditionOptions}
            style={{ width: '180px' }}
          />
          {values.endingCondition === VigilanceArea.EndingCondition.OCCURENCES_NUMBER && (
            <FormikNumberInput
              isErrorMessageHidden
              isLabelHidden
              isRequired
              label="Nombre de fois"
              name="endingOccurrencesNumber"
              style={{ width: '115px' }}
            />
          )}
          {values.endingCondition === VigilanceArea.EndingCondition.END_DATE && (
            <FormikDatePicker
              isErrorMessageHidden
              isLabelHidden
              isRequired
              label="Date de fin de récurrence"
              name="endingOccurenceDate"
              style={{ width: '115px' }}
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
