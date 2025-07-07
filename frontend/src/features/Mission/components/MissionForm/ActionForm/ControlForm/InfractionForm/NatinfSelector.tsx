import { useGetNatinfsQuery } from '@api/natinfsAPI'
import { CustomSearch, MultiSelect } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useMemo } from 'react'

import type { Infraction } from '../../../../../../../domain/entities/missions'
import type { NatinfType } from 'domain/entities/natinfs'

const sortNatinf = (a: NatinfType, b: NatinfType) => {
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
  const { data, isError, isLoading } = useGetNatinfsQuery()

  const sortedNatinfs = useMemo(
    () =>
      (data &&
        [...data]
          ?.sort(sortNatinf)
          .map(item => ({ label: `${item.natinfCode} - ${item.infraction}`, value: item.natinfCode.toString() }))) ||
      [],
    [data]
  )
  const setValue = (nextValue: string[]) => {
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
