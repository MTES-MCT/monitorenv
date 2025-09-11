import { VigilanceArea } from '@features/VigilanceArea/types'
import { Accent, Button, Icon, Label } from '@mtes-mct/monitor-ui'
import { FieldArray, useField } from 'formik'
import styled from 'styled-components'

import { Source } from './Source'

export function Sources() {
  const [field, meta] = useField('sources')

  const internalSources = field.value.filter(
    (source: VigilanceArea.VigilanceAreaSource) => source.type === VigilanceArea.VigilanceAreaSourceType.INTERNAL
  )

  const externalSources = field.value.filter(
    (source: VigilanceArea.VigilanceAreaSource) => source.type !== VigilanceArea.VigilanceAreaSourceType.INTERNAL
  )

  return (
    <FieldArray
      name="sources"
      render={({ push, remove }) => (
        <Wrapper>
          <Label>Sources externes</Label>
          {externalSources.map((source: VigilanceArea.VigilanceAreaSource) => {
            const index = field.value.indexOf(source)

            return (
              <Source
                key={source.id ?? index}
                hasError={meta.error}
                index={index}
                initialSource={source}
                onValidate={vigilanceAreaSource => {
                  remove(index)
                  push(vigilanceAreaSource)
                }}
                remove={remove}
              />
            )
          })}
          <Button
            accent={Accent.SECONDARY}
            Icon={Icon.Plus}
            onClick={() => push({ isAnonymous: false, type: VigilanceArea.VigilanceAreaSourceType.CONTROL_UNIT })}
          >
            Ajouter une unité
          </Button>
          <Button
            accent={Accent.SECONDARY}
            Icon={Icon.Plus}
            onClick={() => push({ isAnonymous: false, type: VigilanceArea.VigilanceAreaSourceType.OTHER })}
          >
            Ajouter une autre source externe
          </Button>

          <StyledLabel>Sources CACEM</StyledLabel>
          {internalSources.map((source: VigilanceArea.VigilanceAreaSource) => {
            const index = field.value.indexOf(source)

            return (
              <Source
                key={source.id ?? index}
                hasError={meta.error}
                index={index}
                initialSource={source}
                onValidate={vigilanceAreaSource => {
                  remove(index)
                  push(vigilanceAreaSource)
                }}
                remove={remove}
              />
            )
          })}
          <Button
            accent={Accent.SECONDARY}
            Icon={Icon.Plus}
            onClick={() => push({ isAnonymous: false, type: VigilanceArea.VigilanceAreaSourceType.INTERNAL })}
          >
            Ajouter une source CACEM
          </Button>
        </Wrapper>
      )}
      validateOnChange={false}
    />
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StyledLabel = styled(Label)`
  margin-top: 12px;
`
