import { getControlUnitsByIds } from '@api/controlUnitsAPI'
import { ControlUnitContactSource } from '@features/VigilanceArea/components/VigilanceAreaForm/ControlUnitContactSource'
import { OtherSource } from '@features/VigilanceArea/components/VigilanceAreaForm/OtherSource'
import { PanelSource } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/PanelSource'
import { VigilanceAreaSourceSchema } from '@features/VigilanceArea/components/VigilanceAreaForm/Schema'
import { ValidateButton } from '@features/VigilanceArea/components/VigilanceAreaForm/style'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, getOptionsFromLabelledEnum, Icon, IconButton, MultiRadio } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { useState } from 'react'
import styled from 'styled-components'

type SourceProps = {
  hasError: string | undefined
  index: number
  initialSource: VigilanceArea.VigilanceAreaSource
  onValidate: (vigilanceAreaSource: VigilanceArea.VigilanceAreaSource) => void
  remove: (index: number) => void
}

export function Source({ hasError, index, initialSource, onValidate, remove }: SourceProps) {
  const sourceOptions = getOptionsFromLabelledEnum(VigilanceArea.VigilanceAreaSourceTypeLabel)
  const isNewlyCreatedSource = Object.values(initialSource).every(value => value === undefined)
  const [sourceType, setSourceType] = useState<string | undefined>(
    isNewlyCreatedSource || (initialSource.controlUnitContacts?.length ?? 0)
      ? VigilanceArea.VigilanceAreaSourceType.CONTROL_UNIT
      : VigilanceArea.VigilanceAreaSourceType.OTHER
  )
  const [isEditing, setIsEditing] = useState(isNewlyCreatedSource)
  const [editedSource, setEditedSource] = useState(initialSource)

  const controlUnitIds = editedSource.controlUnitContacts?.flatMap(contact => contact.controlUnitId) ?? []

  const controlUnits = useAppSelector(state => getControlUnitsByIds(state, controlUnitIds))
  const getControlUnitName = (controlUnitId: number) => {
    const unit = controlUnits.find(controlUnit => controlUnit.id === controlUnitId)

    return `${unit?.name} (${unit?.administration?.name})`
  }
  const isValid = (value: VigilanceArea.VigilanceAreaSource) => VigilanceAreaSourceSchema.isValidSync(value)

  const onChangeSourceType = (nextValue: string | undefined) => {
    if (nextValue === VigilanceArea.VigilanceAreaSourceType.OTHER) {
      setEditedSource(source => ({ ...source, controlUnitContacts: undefined }))
    }
    if (nextValue === VigilanceArea.VigilanceAreaSourceType.CONTROL_UNIT) {
      setEditedSource(source => ({ ...source, email: undefined, name: undefined, phone: undefined }))
    }
    setSourceType(nextValue)
  }

  const cancel = () => {
    if (isNewlyCreatedSource) {
      remove(index)
    } else {
      setEditedSource(initialSource)
      setIsEditing(false)
    }
  }

  const validate = () => {
    setIsEditing(false)
    onValidate(editedSource)
  }

  return (
    <>
      {isEditing ? (
        <>
          <MultiRadio
            data-cy={`reporting-source-selector-${index}`}
            isErrorMessageHidden
            isInline
            label={`Source (${index + 1})`}
            name={`reportingSources[${index}].sourceType`}
            onChange={onChangeSourceType}
            options={sourceOptions}
            // type error if I use styledComponent to style it
            style={{ float: 'left' }}
            value={sourceType}
          />
          <Wrapper>
            {sourceType === 'OTHER' && (
              <OtherSource
                editedSource={editedSource}
                error={hasError}
                onEmailChange={nextValue => {
                  setEditedSource({ ...editedSource, email: nextValue })
                }}
                onNameChange={nextValue => {
                  setEditedSource({ ...editedSource, name: nextValue })
                }}
                onPhoneChange={nextValue => {
                  setEditedSource({ ...editedSource, phone: nextValue })
                }}
              />
            )}
            {sourceType === 'CONTROL_UNIT' && (
              <ControlUnitContactSource
                onSelect={nextValue => {
                  setEditedSource({ ...editedSource, controlUnitContacts: nextValue })
                }}
                source={editedSource}
              />
            )}

            <Buttons>
              <Button accent={Accent.SECONDARY} onClick={cancel}>
                Annuler
              </Button>
              <ValidateButton disabled={!isValid(editedSource)} onClick={validate} type="submit">
                Valider
              </ValidateButton>
            </Buttons>
          </Wrapper>
        </>
      ) : (
        <PanelWrapper>
          <ContactWrapper>
            {initialSource.controlUnitContacts ? (
              <>
                {Object.entries(groupBy(initialSource.controlUnitContacts, source => source.controlUnitId)).map(
                  ([controlUnitId, contacts]) => (
                    <div key={`control_unit_source_${controlUnitId}`}>
                      <PanelSource name={getControlUnitName(+controlUnitId)} />
                      {contacts.map(contact => (
                        <PanelSource
                          key={`control_unit_contact_source_${contact.id}`}
                          email={contact.email}
                          phone={contact.phone}
                        />
                      ))}
                    </div>
                  )
                )}
              </>
            ) : (
              <PanelSource
                key={initialSource.id}
                email={initialSource.email}
                name={initialSource.name}
                phone={initialSource.phone}
              />
            )}
          </ContactWrapper>
          <PanelButtons>
            <IconButton
              accent={Accent.TERTIARY}
              Icon={Icon.EditUnbordered}
              onClick={() => setIsEditing(true)}
              title="Editer la source de la zone de vigilance"
            />
            <IconButton
              accent={Accent.TERTIARY}
              Icon={Icon.Delete}
              onClick={() => remove(index)}
              title="Supprimer la source de la zone de vigilance"
            />
          </PanelButtons>
        </PanelWrapper>
      )}
    </>
  )
}

const Wrapper = styled.div`
  background-color: ${$p => $p.theme.color.gainsboro};
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const PanelWrapper = styled.div`
  background-color: ${$p => $p.theme.color.gainsboro};
  padding: 8px;
  display: flex;
  gap: 8px;
  align-content: center;
  justify-content: space-between;
`

const ContactWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const PanelButtons = styled.div`
  margin: auto 0;
`

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
`
