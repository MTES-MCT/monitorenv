import { MultiSelect } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useMemo } from 'react'

import { useGetInfractionsQuery } from '../../../../../../api/infractionsAPI'
import { useNewWindow } from '../../../../../../ui/NewWindow'

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
  const { newWindowContainerRef } = useNewWindow()
  const [natinfField, meta, natinfHelpers] = useField(`${infractionPath}.natinf`)
  const { data, isError, isLoading } = useGetInfractionsQuery()

  const sortedData = useMemo(
    () =>
      (data &&
        [...data]
          ?.sort(sortNatinf)
          .map(item => ({ label: `${item.natinfCode} - ${item.infraction}`, value: item.natinfCode }))) ||
      [],
    [data]
  )

  const setValue = (nextValue: string[] | undefined) => {
    natinfHelpers.setValue(nextValue)
  }

  if (isError) {
    return <div>Erreur</div>
  }

  if (isLoading) {
    return <div>Chargement</div>
  }

  return (
    <MultiSelect
      baseContainer={newWindowContainerRef.current}
      block
      error={meta.error}
      label="NATINF"
      name="infraction-natinf"
      onChange={setValue}
      options={sortedData}
      searchable
      value={natinfField.value}
      valueKey="value"
    />
  )
}
