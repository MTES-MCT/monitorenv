import { Period } from '@features/VigilanceArea/components/VigilanceAreaForm/Period'
import { getVigilanceAreaPeriodInitialValues } from '@features/VigilanceArea/components/VigilanceAreaForm/utils'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { Accent, Button, Checkbox, Icon } from '@mtes-mct/monitor-ui'
import { FieldArray, useField } from 'formik'
import styled from 'styled-components'

export function Periods() {
  const [field, meta, helper] = useField<VigilanceArea.VigilanceAreaPeriod[]>('periods')
  const periods = field.value

  const setIsAtAllTimes = async (
    isChecked: boolean | undefined,
    isCritical: boolean,
    push: (vigilanceArea: VigilanceArea.VigilanceAreaPeriod) => void,
    remove: (index: number) => void
  ) => {
    async function removeRemainingPeriod() {
      await helper.setValue(field.value.filter(period => period.isCritical !== isCritical))
    }

    const vigilanceAreaPeriod: VigilanceArea.VigilanceAreaPeriod = {
      ...getVigilanceAreaPeriodInitialValues(),
      isAtAllTimes: true,
      isCritical
    }
    const index = field.value.findIndex(period => period.isAtAllTimes && period.isCritical === isCritical)

    if (isChecked && index === -1) {
      await removeRemainingPeriod()
      push(vigilanceAreaPeriod)
    }

    if (!isChecked && index !== -1) {
      remove(index)
    }
  }

  return (
    <>
      <FieldArray
        name="periods"
        render={({ push, remove }) => {
          const hasSimpleIsAtAllTimesPeriod = periods.some(period => period.isAtAllTimes && !period.isCritical)
          const hasCriticalIsAtAllTimesPeriod = periods.some(period => period.isAtAllTimes && period.isCritical)

          return (
            <Wrapper>
              <CheckboxesWrapper>
                <CheckboxWrapper>
                  <StyledCircle />
                  <CriticalCheckbox
                    checked={hasSimpleIsAtAllTimesPeriod}
                    isLight
                    label="Vigilance simple en tout temps"
                    name="isSimpleAtAllTimes"
                    onChange={isChecked => setIsAtAllTimes(isChecked, false, push, remove)}
                  />
                </CheckboxWrapper>
                <CheckboxWrapper>
                  <StyledCircle $isCritical />
                  <CriticalCheckbox
                    checked={hasCriticalIsAtAllTimesPeriod}
                    isLight
                    label="Vigilance critique en tout temps"
                    name="isCriticalAtAllTimes"
                    onChange={isChecked => setIsAtAllTimes(isChecked, true, push, remove)}
                  />
                </CheckboxWrapper>
              </CheckboxesWrapper>
              {periods
                .filter((period: VigilanceArea.VigilanceAreaPeriod) => !period.isAtAllTimes)
                .map((period: VigilanceArea.VigilanceAreaPeriod) => {
                  const index = field.value.indexOf(period)

                  return (
                    <Period
                      key={period.id ?? index}
                      hasError={meta.error}
                      index={index}
                      initialPeriod={period}
                      onValidate={vigilanceAreaPeriod => {
                        remove(index)
                        push(vigilanceAreaPeriod)
                      }}
                      remove={remove}
                    />
                  )
                })}
              <Button
                accent={Accent.SECONDARY}
                disabled={hasSimpleIsAtAllTimesPeriod || hasCriticalIsAtAllTimesPeriod}
                Icon={Icon.Plus}
                onClick={() =>
                  push({
                    isAtAllTimes: false,
                    isCritical: false
                  })
                }
              >
                Ajouter une période de vigilance simple
              </Button>
              <Button
                accent={Accent.ERROR}
                disabled={hasCriticalIsAtAllTimesPeriod}
                Icon={Icon.Plus}
                onClick={() =>
                  push({
                    isAtAllTimes: false,
                    isCritical: true
                  })
                }
              >
                Ajouter une période de vigilance critique
              </Button>
            </Wrapper>
          )
        }}
        validateOnChange={false}
      />
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid ${p => p.theme.color.lightGray};
  padding-top: 8px;
`

export const CriticalCheckbox = styled(Checkbox)`
  label {
    margin-left: 14px;
  }
`

export const CheckboxWrapper = styled.div`
  position: relative;
`

export const CheckboxesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
`

export const StyledCircle = styled.div<{ $isCritical?: boolean }>`
  height: 10px;
  width: 10px;
  margin-right: 6px;
  background-color: ${p => (p.$isCritical ? 'rgba(194, 81, 65, 0.75)' : 'rgba(194, 81, 65, 0.5)')};
  border: ${p => (p.$isCritical ? '2px solid #E1000F' : '1px solid rgba(147, 63, 32, 0.75)')};
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  left: 22px;
  top: 0;
  transform: translateY(50%);
`
