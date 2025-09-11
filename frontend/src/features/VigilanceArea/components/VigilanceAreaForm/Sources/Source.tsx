import { getControlUnitsByIds } from '@api/controlUnitsAPI'
import { PanelSource } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/PanelSource'
import { VigilanceAreaSourceSchema } from '@features/VigilanceArea/components/VigilanceAreaForm/Schema'
import { ValidateButton } from '@features/VigilanceArea/components/VigilanceAreaForm/style'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { groupBy, omit } from 'lodash'
import { useState } from 'react'
import styled from 'styled-components'

import { ControlUnitContactSource } from './ControlUnitContactSource'
import { OtherOrInternalSource } from './OtherOrInternalSource'

type SourceProps = {
  hasError: string | undefined
  index: number
  initialSource: VigilanceArea.VigilanceAreaSource
  onValidate: (vigilanceAreaSource: VigilanceArea.VigilanceAreaSource) => void
  remove: (index: number) => void
}

export function Source({ hasError, index, initialSource, onValidate, remove }: SourceProps) {
  const isNewlyCreatedSource = Object.values(omit(initialSource, ['type', 'isAnonymous'])).every(
    value => value === undefined
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
          <Wrapper>
            {initialSource.type !== VigilanceArea.VigilanceAreaSourceType.CONTROL_UNIT && (
              <OtherOrInternalSource
                error={hasError}
                onEditSource={setEditedSource}
                source={editedSource}
                type={initialSource.type}
              />
            )}
            {initialSource.type === VigilanceArea.VigilanceAreaSourceType.CONTROL_UNIT && (
              <ControlUnitContactSource onEditSource={setEditedSource} source={editedSource} />
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
            {initialSource.type === VigilanceArea.VigilanceAreaSourceType.CONTROL_UNIT ? (
              <>
                {Object.entries(groupBy(initialSource.controlUnitContacts, source => source.controlUnitId)).map(
                  ([controlUnitId, contacts]) => (
                    <div key={`control_unit_source_${controlUnitId}`}>
                      <PanelSource isAnonymous={initialSource.isAnonymous} name={getControlUnitName(+controlUnitId)} />
                      {contacts.map(contact => (
                        <PanelSource
                          key={`control_unit_contact_source_${contact.id}`}
                          comments={initialSource.comments}
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
                comments={initialSource.comments}
                email={initialSource.email}
                isAnonymous={initialSource.isAnonymous}
                link={initialSource.link}
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
  flex: 1;
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
  display: flex;
  margin: auto 0;
`

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
`
