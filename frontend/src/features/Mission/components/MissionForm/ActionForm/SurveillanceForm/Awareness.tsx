import { Checkbox, FormikNumberInput, FormikSelect, Label } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useEffect } from 'react'
import styled from 'styled-components'

import type { CheckTreePickerOption } from '@mtes-mct/monitor-ui'
import type { EnvActionSurveillance, Mission } from 'domain/entities/missions'
import type { ThemeAPI } from 'domain/entities/themes'

type AwarenessProps = {
  awarenessOptions: CheckTreePickerOption[]
  formPath: string
}
export function Awareness({ awarenessOptions, formPath }: AwarenessProps) {
  const { setFieldValue } = useFormikContext<Mission<EnvActionSurveillance>>()

  const [{ value: isRisingAwareness }] = useField(`${formPath}.awareness.isRisingAwareness`)

  const [themes] = useField<ThemeAPI[]>(`${formPath}.themes`)

  useEffect(() => {
    if (themes.value.length === 1 && isRisingAwareness) {
      setFieldValue(`${formPath}.awareness.themeId`, themes.value[0]?.id)
    }
  }, [themes.value, formPath, isRisingAwareness, setFieldValue])

  const updateIsRisingAwareness = (isChecked: boolean | undefined) => {
    if (isChecked) {
      setFieldValue(`${formPath}.awareness`, { isRisingAwareness: true })
    } else {
      setFieldValue(`${formPath}.awareness`, undefined)
    }
  }

  return (
    <>
      <div>
        <Label>Prévention</Label>
        <Checkbox
          checked={isRisingAwareness}
          data-cy="surveillance-awareness"
          inline
          isLight
          label="La surveillance a donné lieu à des actions de prévention"
          name={`${formPath}.awareness.isRisingAwareness`}
          onChange={updateIsRisingAwareness}
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
