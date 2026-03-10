import { useGetNatinfsQuery, useLazyGetThemesNatinfsQuery } from '@api/natinfsAPI'
import { NatinfSelectedOption } from '@features/Mission/components/MissionForm/ActionForm/ControlForm/InfractionForm/NatinfSelectedOption'
import { CustomSearch, MultiSelect } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import type { Infraction } from '../../../../../../../domain/entities/missions'
import type { NatinfType } from 'domain/entities/natinfs'

type NatinfSelectorProps = {
  infractionPath: string
  themesIds?: number[]
}

const sortNatinf = (a: NatinfType, b: NatinfType) => {
  if (a?.natinfCode < b?.natinfCode) {
    return -1
  }
  if (a?.natinfCode > b?.natinfCode) {
    return 1
  }

  return 0
}

export function NatinfSelector({ infractionPath, themesIds }: NatinfSelectorProps) {
  const [natinfField, meta, natinfHelpers] = useField<Infraction['natinf']>(`${infractionPath}.natinf`)
  const [themesNatinfs, setThemesNatinfs] = useState<NatinfType[]>()
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const { data: allNatinfs, isError, isLoading } = useGetNatinfsQuery()
  const [getThemesNatinfs] = useLazyGetThemesNatinfsQuery()

  useEffect(() => {
    if (!themesIds || themesIds.length === 0) {
      setThemesNatinfs(undefined)

      return
    }
    getThemesNatinfs(themesIds)
      .unwrap()
      .then(result => setThemesNatinfs(result))
  }, [getThemesNatinfs, themesIds, allNatinfs])
  const hasSuggestedNatinfs = themesNatinfs && themesNatinfs.length > 0 && !isSearching

  const sortedNatinfs = useMemo(() => {
    const natinfsToSort = (hasSuggestedNatinfs ? themesNatinfs : allNatinfs) ?? []

    return [...natinfsToSort]?.sort(sortNatinf).map(item => ({
      label: item.infraction,
      title: hasSuggestedNatinfs ? 'Suggestions par rapport aux sous-thématiques sélectionnées' : '',
      value: item.natinfCode.toString()
    }))
  }, [allNatinfs, hasSuggestedNatinfs, themesNatinfs])

  const setValue = (nextValue: string[]) => {
    natinfHelpers.setValue(nextValue)
    setIsSearching(false)
  }

  const removeValue = (nextValue: string) => {
    const natinfCodes = natinfField.value
    const nextNatinfs = natinfCodes?.filter(natinfCode => natinfCode !== nextValue)
    natinfHelpers.setValue(nextNatinfs)
  }

  const onSearch = (nextQuery: string) => {
    setIsSearching(!!nextQuery)
  }

  const customSearch = useMemo(() => new CustomSearch(sortedNatinfs, ['label', 'value']), [sortedNatinfs])

  const customRenderMenuItem = useCallback(
    (_, item) => (
      <span>
        <NatinfCode>{item.value}</NatinfCode> <NatinfLabel>{item.label}</NatinfLabel>
      </span>
    ),
    []
  )

  if (isError) {
    return <div>Erreur</div>
  }

  if (isLoading) {
    return <div>Chargement</div>
  }

  return (
    <MultiSelect
      block
      customRenderMenuItem={customRenderMenuItem}
      customSearch={customSearch}
      data-cy={`natinf-selector-${infractionPath}`}
      error={meta.error}
      groupBy={hasSuggestedNatinfs ? 'title' : undefined}
      isErrorMessageHidden
      isRequired
      label="NATINF"
      name="infraction-natinf"
      onChange={setValue}
      onSearch={onSearch}
      options={sortedNatinfs}
      renderValue={(values: string[] | undefined) => {
        const matchingNatinfs = allNatinfs?.filter(natinf => values?.includes(natinf.natinfCode.toString()))

        return matchingNatinfs?.map(item => (
          <NatinfSelectedOption
            key={item.natinfCode}
            label={item.infraction}
            onRemove={removeValue}
            value={item.natinfCode.toString()}
          />
        ))
      }}
      searchable
      value={natinfField.value}
    />
  )
}

const NatinfCode = styled.span`
  color: ${({ theme }) => theme.color.slateGray};
  margin-right: 6px;
`

const NatinfLabel = styled.span`
  color: ${({ theme }) => theme.color.gunMetal};
  font-weight: 500;
`
