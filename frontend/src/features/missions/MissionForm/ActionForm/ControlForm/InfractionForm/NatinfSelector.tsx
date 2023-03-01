/* eslint-disable react/jsx-props-no-spreading */
import { MultiSelect } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useMemo } from 'react'
import { Form } from 'rsuite'
import styled from 'styled-components'

import { useGetInfractionsQuery } from '../../../../../../api/infractionsAPI'
import { useNewWindow } from '../../../../../../ui/NewWindow'

import type { NatinfType } from '../../../../../../domain/entities/natinfs'

const sortNatinf = (a, b) => {
  if (a?.natinfCode < b?.natinfCode) {
    return -1
  }
  if (a?.natinfCode > b?.natinfCode) {
    return 1
  }

  return 0
}

export function NatinfSelector({ infractionPath, ...props }) {
  const { newWindowContainerRef } = useNewWindow()
  const [natinfField, , natinfHelpers] = useField(`${infractionPath}.natinf`)
  const { data, isError, isLoading } = useGetInfractionsQuery()

  const valuesAsOptions = useMemo(
    () => natinfField.value.map(natinfCode => data?.find(natinf => natinf.natinfCode === natinfCode)),
    [data, natinfField]
  )
  const sortedData = useMemo(
    () =>
      (data &&
        [...data]?.sort(sortNatinf).map(item => ({ label: `${item.natinfCode} - ${item.infraction}`, value: item }))) ||
      [],
    [data]
  )

  const setValue = (nextValue: NatinfType[] | undefined) => {
    const natinfCodes = nextValue?.map(natinf => natinf.natinfCode) || []
    natinfHelpers.setValue(natinfCodes)
  }

  if (isError) {
    return <div>Erreur</div>
  }

  if (isLoading) {
    return <div>Chargement</div>
  }

  return (
    <SelectorWrapper>
      <Form.ControlLabel htmlFor="natinf">NATINF</Form.ControlLabel>
      <MultiSelect<NatinfType>
        baseContainer={newWindowContainerRef.current}
        block
        defaultValue={valuesAsOptions}
        isLabelHidden
        label="infraction-natinf"
        name="infraction-natinf"
        onChange={setValue}
        options={sortedData}
        searchable
        virtualized
        {...props}
      />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  position: relative;
`
