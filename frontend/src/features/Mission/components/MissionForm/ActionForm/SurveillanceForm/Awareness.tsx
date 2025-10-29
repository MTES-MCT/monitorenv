import {
  Accent,
  Button,
  Checkbox,
  FormikNumberInput,
  FormikSelect,
  Icon,
  IconButton,
  Label,
  type Option
} from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useEffect } from 'react'
import styled from 'styled-components'

import type { EnvActionSurveillance, Mission } from 'domain/entities/missions'
import type { ThemeFromAPI } from 'domain/entities/themes'

type AwarenessProps = {
  awarenessOptions: Option<number>[]
  formPath: string
}
export function Awareness({ awarenessOptions, formPath }: AwarenessProps) {
  const { setFieldValue } = useFormikContext<Mission<EnvActionSurveillance>>()

  const [{ value: awareness }] = useField(`${formPath}.awareness`)

  const [themes] = useField<ThemeFromAPI[] | undefined>(`${formPath}.themes`)

  useEffect(() => {
    if (themes?.value?.length === 1 && awareness?.isRisingAwareness) {
      setFieldValue(`${formPath}.awareness.details`, [{ themeId: themes.value[0]?.id }])
    }
  }, [themes.value, formPath, awareness?.isRisingAwareness, setFieldValue])

  const updateIsRisingAwareness = (isChecked: boolean | undefined) => {
    if (isChecked) {
      setFieldValue(`${formPath}.awareness`, {
        details: [{ nbPerson: undefined, themeId: undefined }],
        isRisingAwareness: true
      })
    } else {
      setFieldValue(`${formPath}.awareness`, undefined)
    }
  }

  const addAwerenessDetail = () => {
    const newAvereness = [...awareness.details, { nbPerson: undefined, themeId: undefined }]
    setFieldValue(`${formPath}.awareness.details`, newAvereness)
  }

  const removeAwarenessDetail = index => {
    const updatedAwarenessDetails = awareness.details.filter((_, i) => i !== index)
    setFieldValue(`${formPath}.awareness.details`, updatedAwarenessDetails)
  }

  return (
    <>
      <div>
        <Label>Prévention</Label>
        <Checkbox
          checked={awareness?.isRisingAwareness}
          data-cy="surveillance-awareness"
          inline
          isLight
          label="La surveillance a donné lieu à des actions de prévention"
          name={`${formPath}.awareness.isRisingAwareness`}
          onChange={updateIsRisingAwareness}
        />
      </div>

      {awareness?.isRisingAwareness && (
        <AwarenessWrapper data-cy="surveillance-awareness-fields">
          <>
            {awareness.details?.map((_, index) => (
              <>
                {index !== 0 && <Separator />}
                <Details>
                  <NbPerson
                    data-cy={`surveillance-awareness-nb-person-${index}`}
                    isErrorMessageHidden
                    isLight
                    label="Nb de personnes informées"
                    name={`${formPath}.awareness.details[${index}].nbPerson`}
                  />
                  <AwarenessTheme
                    key={awarenessOptions.length}
                    $withDeleteButton={index !== 0}
                    data-cy={`surveillance-awareness-select-${index}`}
                    disabled={awarenessOptions.length === 1}
                    isErrorMessageHidden
                    isLight
                    label="Thématiques de prévention"
                    name={`${formPath}.awareness.details[${index}].themeId`}
                    options={awarenessOptions}
                  />
                  {index !== 0 && (
                    <StyledIconButton
                      accent={Accent.SECONDARY}
                      Icon={Icon.Delete}
                      onClick={() => removeAwarenessDetail(index)}
                    />
                  )}
                </Details>
              </>
            ))}
          </>
          {themes?.value && themes?.value?.length !== awareness.details?.length && (
            <Button accent={Accent.SECONDARY} Icon={Icon.Plus} onClick={addAwerenessDetail}>
              Ajouter une thématique de surveillance
            </Button>
          )}
        </AwarenessWrapper>
      )}
    </>
  )
}

const AwarenessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const Details = styled.div`
  align-items: end;
  display: flex;
  gap: 8px;
`

const NbPerson = styled(FormikNumberInput)`
  width: 35%;
`
const AwarenessTheme = styled(FormikSelect)<{ $withDeleteButton: boolean }>`
  width: ${p => (p.$withDeleteButton ? '57%' : '64%')};
`
const StyledIconButton = styled(IconButton)`
  align-self: end;
  svg {
    color: ${p => p.theme.color.maximumRed};
  }
`
const Separator = styled.div`
  border-bottom: 2px solid ${p => p.theme.color.lightGray};
  margin: 8px 0;
`
