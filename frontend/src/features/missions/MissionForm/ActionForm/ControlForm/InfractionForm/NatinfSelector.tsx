import { MultiSelect } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useMemo } from 'react'

import { useGetInfractionsQuery } from '../../../../../../api/infractionsAPI'
import { useNewWindow } from '../../../../../../ui/NewWindow'

import type { NatinfType } from '../../../../../../domain/entities/natinfs'

export function NatinfSelector({ infractionPath }) {
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
    <MultiSelect<NatinfType>
      baseContainer={newWindowContainerRef.current}
      block
      label="NATINF"
      name="infraction-natinf"
      onChange={setValue}
      options={sortedData}
      searchable
      value={valuesAsOptions}
      virtualized
    />
  )
}

const sortNatinf = (a, b) => {
  if (a?.natinfCode < b?.natinfCode) {
    return -1
  }
  if (a?.natinfCode > b?.natinfCode) {
    return 1
  }

  return 0
}
