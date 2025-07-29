import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { Bold } from '@components/style'
import { formatPhoneNumber } from '@features/ControlUnit/components/ControlUnitDialog/ControlUnitContactList/Item'
import { VigilanceArea } from '@features/VigilanceArea/types'
import {
  Checkbox,
  ControlUnit,
  CustomSearch,
  Fieldset,
  getOptionsFromIdAndName,
  Link,
  Select
} from '@mtes-mct/monitor-ui'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

export function ControlUnitContactSource({
  onSelect,
  source
}: {
  onSelect: (controlUnitContacts: ControlUnit.ControlUnitContactData[] | undefined) => void
  source: VigilanceArea.VigilanceAreaSource
}) {
  const { data: controlUnitsData } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const [selectedControlUnitContacts, setSelectedControlUnitContacts] = useState<ControlUnit.ControlUnitContactData[]>(
    source.controlUnitContacts ?? []
  )

  const unitsWithContactAsOption = useMemo(
    () =>
      getOptionsFromIdAndName(controlUnitsData?.filter(controlUnit => controlUnit.controlUnitContacts.length > 0)) ??
      [],
    [controlUnitsData]
  )
  const controlUnitCustomSearch = useMemo(
    () =>
      new CustomSearch(unitsWithContactAsOption, ['label'], {
        isStrict: true,
        threshold: 0.2
      }),
    [unitsWithContactAsOption]
  )
  const [selectedControlUnitId, setSelectedControlUnitId] = useState(
    (source.controlUnitContacts?.length ?? 0) > 0 ? source.controlUnitContacts?.[0]?.controlUnitId : undefined
  )
  const selectedControlUnit = useMemo(
    () => controlUnitsData?.find(unit => unit.id === selectedControlUnitId),
    [controlUnitsData, selectedControlUnitId]
  )

  const onSelectControlUnitContact = (
    checked: boolean | undefined,
    controlUnitContact: ControlUnit.ControlUnitContactData
  ) => {
    const nextSelectedControlUnitContacts = checked
      ? [...selectedControlUnitContacts, controlUnitContact]
      : selectedControlUnitContacts.filter(contact => contact.id !== controlUnitContact.id)
    setSelectedControlUnitContacts(nextSelectedControlUnitContacts)
    onSelect(nextSelectedControlUnitContacts)
  }

  const onChangeControlUnitId = (nextValue: number | undefined) => {
    if (nextValue !== selectedControlUnitId) {
      setSelectedControlUnitContacts([])
      onSelect(undefined)
      setSelectedControlUnitId(nextValue)
    }
  }

  return (
    <>
      <Select
        key={unitsWithContactAsOption.length}
        customSearch={unitsWithContactAsOption.length > 10 ? controlUnitCustomSearch : undefined}
        isErrorMessageHidden
        isLight
        label="Nom de l'unité"
        name="unit"
        onChange={onChangeControlUnitId}
        options={unitsWithContactAsOption ?? []}
        searchable={unitsWithContactAsOption.length > 10}
        value={selectedControlUnitId}
      />
      {selectedControlUnit && (
        <>
          <Fieldset isLegendHidden legend={`Contacts de ${selectedControlUnit.name}`} />
          {selectedControlUnit.controlUnitContacts.map(controlUnitContact => (
            <Wrapper key={controlUnitContact.id}>
              <Checkbox
                checked={
                  !!selectedControlUnitContacts.find(selectedContact => selectedContact.id === controlUnitContact.id)
                }
                label={
                  <Contact>
                    <FirstLine>
                      <Bold>
                        {ControlUnit.ControlUnitContactPredefinedName[controlUnitContact.name] ||
                          controlUnitContact.name}
                      </Bold>{' '}
                      {controlUnitContact.phone && <Phone>{formatPhoneNumber(controlUnitContact.phone)}</Phone>}
                    </FirstLine>{' '}
                    <Link href={`mailto:${controlUnitContact.email}`} rel="noreferrer" target="_blank">
                      {controlUnitContact.email}
                    </Link>
                  </Contact>
                }
                name="select"
                onChange={checked => onSelectControlUnitContact(checked, controlUnitContact)}
              />
            </Wrapper>
          ))}
        </>
      )}
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  background: ${$p => $p.theme.color.white};
  padding: 8px;
  justify-content: space-between;
`

const Contact = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const FirstLine = styled.span`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-bottom: 4px;
`

const Phone = styled.span`
  color: ${$p => $p.theme.color.slateGray};
`
