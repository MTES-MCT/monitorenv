import { CustomSearch, MultiSelect, type Option } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useGetInfractionsQuery } from '../../../../../../api/infractionsAPI'

import type { Infraction } from '../../../../../../domain/entities/missions'

const sortNatinf = (a, b) => {
  if (a?.natinfCode < b?.natinfCode) {
    return -1
  }
  if (a?.natinfCode > b?.natinfCode) {
    return 1
  }

  return 0
}

export function NatinfSelector({ infractionPath }) {
  const [natinfField, meta, natinfHelpers] = useField<Infraction['natinf']>(`${infractionPath}.natinf`)
  const { data, isError, isLoading } = useGetInfractionsQuery()

  const sortedNatinfs: Array<Option<string>> = useMemo(
    () =>
      (data &&
        [...data]
          ?.sort(sortNatinf)
          .map(item => ({ label: `${item.natinfCode} - ${item.infraction}`, value: item.natinfCode.toString() }))) ||
      [],
    [data]
  )
  const setValue = nextValue => {
    natinfHelpers.setValue(nextValue)
  }

  const customSearch = useMemo(() => new CustomSearch(sortedNatinfs, ['label', 'value']), [sortedNatinfs])

  if (isError) {
    return <div>Erreur</div>
  }

  if (isLoading) {
    return <div>Chargement</div>
  }

  return (
    <StyledMultiSelect
      block
      customSearch={customSearch}
      error={meta.error}
      isErrorMessageHidden
      isRequired
      label="NATINF"
      name="infraction-natinf"
      onChange={setValue}
      options={sortedNatinfs as Array<Option<string>>}
      searchable
      value={natinfField.value}
    />
  )
}

const StyledMultiSelect = styled(MultiSelect)`
  .rs-tag {
    /* TODO Investigate both these props which are a hack to fix long NATINFs breaking the layout. */
    max-width: 450px !important;
  }
`
