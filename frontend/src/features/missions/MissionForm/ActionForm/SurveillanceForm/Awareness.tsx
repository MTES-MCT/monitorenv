import { FormikCheckbox, FormikNumberInput, FormikSelect, Label } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useEffect } from 'react'
import styled from 'styled-components'

import type { Option } from '@mtes-mct/monitor-ui'
import type { ControlPlansData } from 'domain/entities/controlPlan'
import type { EnvActionSurveillance, Mission } from 'domain/entities/missions'

type AwarenessProps = {
  awarenessOptions: Option<number>[]
  formPath: string
}
export function Awareness({ awarenessOptions, formPath }: AwarenessProps) {
  const { setFieldValue } = useFormikContext<Mission<EnvActionSurveillance>>()

  const [{ value: isRisingAwareness }] = useField(`${formPath}.awareness.isRisingAwareness`)

  const [controlPlans] = useField<ControlPlansData[]>(`${formPath}.controlPlans`)

  useEffect(() => {
    if (controlPlans.value.length === 1 && isRisingAwareness) {
      setFieldValue(`${formPath}.awareness.themeId`, controlPlans.value[0]?.themeId)
    }
    if (!isRisingAwareness) {
      setFieldValue(`${formPath}.awareness`, undefined)
    }
  }, [controlPlans.value, formPath, isRisingAwareness, setFieldValue])

  return (
    <>
      <div>
        <Label>Prévention</Label>
        <FormikCheckbox
          data-cy="surveillance-awareness"
          inline
          isLight
          label="La surveillance a donné lieu à des actions de prévention"
          name={`${formPath}.awareness.isRisingAwareness`}
        />
      </div>

      {isRisingAwareness && (
        <AwarenessWrapper data-cy="surveillance-awareness-fields">
          <NbPerson isLight label="Nb de personnes informées" name={`${formPath}.awareness.nbPerson`} />
          <AwarenessTheme
            key={awarenessOptions.length}
            data-cy="surveillance-awareness-select"
            disabled={awarenessOptions.length === 1}
            isErrorMessageHidden
            isLight
            label="Thématiques de prévention"
            name={`${formPath}.awareness.themeId`}
            options={awarenessOptions}
          />
        </AwarenessWrapper>
      )}
    </>
  )
}

const AwarenessWrapper = styled.div`
  display: flex;
  gap: 16px;
`
const NbPerson = styled(FormikNumberInput)`
  width: 40%;
`
const AwarenessTheme = styled(FormikSelect)`
  width: 60%;
`
