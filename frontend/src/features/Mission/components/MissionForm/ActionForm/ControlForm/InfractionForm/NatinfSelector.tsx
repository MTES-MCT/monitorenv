import { CustomSearch, MultiSelect } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useMemo } from 'react'

import { useGetInfractionsQuery } from '../../../../../../../api/infractionsAPI'

import type { Infraction } from '../../../../../../../domain/entities/missions'

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

  const sortedNatinfs = useMemo(
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
    <MultiSelect
      block
      customSearch={customSearch}
      error={meta.error}
      isErrorMessageHidden
      isRequired
      label="NATINF"
      name="infraction-natinf"
      onChange={setValue}
      options={sortedNatinfs}
      searchable
      value={natinfField.value}
    />
  )
}
