import { Period } from '@features/VigilanceArea/components/VigilanceAreaForm/Period'
import { getVigilanceAreaPeriodInitialValues } from '@features/VigilanceArea/components/VigilanceAreaForm/utils'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { Accent, Button, Checkbox, customDayjs, Icon, Legend } from '@mtes-mct/monitor-ui'
import { FieldArray, useFormikContext } from 'formik'
import styled from 'styled-components'

export function Periods() {
  const { errors, setFieldValue, values } = useFormikContext<VigilanceArea.VigilanceArea>()

  const { periods } = values
  const setIsAtAllTimes = (isChecked: boolean | undefined, isCritical: boolean) => {
    const filtered = periods?.filter(period => period.isCritical !== isCritical)

    const index = periods?.findIndex(period => period.isAtAllTimes && period.isCritical === isCritical) ?? -1

    if (isChecked && index === -1) {
      const vigilanceAreaPeriod: VigilanceArea.VigilanceAreaPeriod = {
        ...getVigilanceAreaPeriodInitialValues(),
        isAtAllTimes: true,
        isCritical
      }
      const newVigilanceAreaperiods = [...(filtered ?? []), vigilanceAreaPeriod]
      setFieldValue('periods', newVigilanceAreaperiods)
    }

    if (!isChecked && index !== -1) {
      setFieldValue('periods', filtered)
    }
  }

  return (
    <FieldArray
      name="periods"
      render={({ push, remove, replace }) => {
        const hasSimpleIsAtAllTimesPeriod = periods?.some(period => period.isAtAllTimes && !period.isCritical)
        const hasCriticalIsAtAllTimesPeriod = periods?.some(period => period.isAtAllTimes && period.isCritical)

        return (
          <Wrapper>
            <CheckboxesWrapper>
              <HiddenLegend>Type de période de vigilance en tout temps</HiddenLegend>
              <CheckboxWrapper>
                <PeriodCircle />
                <CriticalCheckbox
                  checked={hasSimpleIsAtAllTimesPeriod}
                  isLight
                  label="Vigilance simple en tout temps"
                  name="isSimpleAtAllTimes"
                  onChange={isChecked => setIsAtAllTimes(isChecked, false)}
                />
              </CheckboxWrapper>
              <CheckboxWrapper>
                <PeriodCircle $isCritical />
                <CriticalCheckbox
                  checked={hasCriticalIsAtAllTimesPeriod}
                  isLight
                  label="Vigilance critique en tout temps"
                  name="isCriticalAtAllTimes"
                  onChange={isChecked => setIsAtAllTimes(isChecked, true)}
                />
              </CheckboxWrapper>
            </CheckboxesWrapper>
            {periods
              ?.filter((period: VigilanceArea.VigilanceAreaPeriod) => !period.isAtAllTimes)
              .sort((a, b) => {
                if (!a.startDatePeriod) {
                  return -1
                }
                if (!b.startDatePeriod) {
                  return 1
                }

                return customDayjs(a.startDatePeriod).valueOf() - customDayjs(b.startDatePeriod).valueOf()
              })
              .map((period: VigilanceArea.VigilanceAreaPeriod) => {
                const index = periods?.indexOf(period)

                return (
                  <Period
                    key={period.id ?? index}
                    hasError={errors.periods}
                    index={index}
                    initialPeriod={period}
                    onValidate={vigilanceAreaPeriod => {
                      replace(index, vigilanceAreaPeriod)
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
                  ...getVigilanceAreaPeriodInitialValues(),
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
                  ...getVigilanceAreaPeriodInitialValues(),
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

export const CheckboxesWrapper = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
  border: none;
`

export const BasePeriodCircle = styled.div<{ $isCritical?: boolean }>`
  height: 10px;
  width: 10px;
  background-color: ${p => (p.$isCritical ? 'rgba(194, 81, 65, 0.75)' : 'rgba(194, 81, 65, 0.5)')};
  border: ${p => (p.$isCritical ? '2px solid #E1000F' : '1px solid rgba(147, 63, 32, 0.75)')};
  border-radius: 50%;
  display: inline-block;
`

export const PeriodCircle = styled(BasePeriodCircle)`
  margin-right: 6px;
  position: absolute;
  left: 22px;
  top: 0;
  transform: translateY(50%);
`

const HiddenLegend = styled(Legend)`
  width: 1px;
  height: 1px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  position: absolute;
  left: -10000px;
`
