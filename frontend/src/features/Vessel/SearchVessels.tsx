import { useVessels } from '@features/Vessel/hooks/useVessels'
import { toOptions } from '@features/Vessel/utils'
import { VesselSearchItem } from '@features/Vessel/VesselSearchItem'
import { CustomSearch, Search, Size } from '@mtes-mct/monitor-ui'
import { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'

import type { Vessel } from '@features/Vessel/types'
import type { RsuiteDataItem } from '@mtes-mct/monitor-ui/types/internals'

type SearchVesselsProps = {
  disabled?: boolean
  isLight?: boolean
  onChange?: (vessel: Vessel.Identity | undefined) => void
  optionsWidth?: string
  value?: Vessel.Identity | undefined
}

export function SearchVessel({ disabled, isLight = true, onChange, optionsWidth, value }: SearchVesselsProps) {
  const isSelecting = useRef(false)
  const [query, setQuery] = useState<string | undefined>()
  const [debouncedQuery] = useDebounce(query, 300)
  const { options } = useVessels(debouncedQuery)
  const optionsOnDefaultValue = useMemo(() => (value ? toOptions([value]) : undefined), [value])

  const vesselCustomSearch = new CustomSearch(options ?? [], [
    'label',
    'value.imo',
    'value.mmsi',
    'value.immatriculation'
  ])
  const flagUrl =
    value &&
    `${window.location.origin}/flags/${
      value?.flag ? `${value?.flag.substring(0, 2).toLowerCase()}.svg` : 'unknown.png'
    }`

  return (
    <StyledSearch
      key="vessel-search"
      $backgroundImageUrl={flagUrl}
      $optionsWidth={optionsWidth}
      customSearch={vesselCustomSearch}
      data-cy="vessel-search-input"
      disabled={disabled}
      isLabelHidden
      isLight={isLight}
      isSearchIconHidden
      isUndefinedWhenDisabled
      label="Rechercher un navire"
      name="search-vessel"
      onChange={(item: Vessel.Identity) => {
        isSelecting.current = true
        if (onChange) {
          onChange(item)
        }
      }}
      onQuery={nextQuery => {
        setQuery(nextQuery)
        if (isSelecting.current && onChange && value) {
          onChange(undefined)
        }
      }}
      options={options.length === 0 && value ? optionsOnDefaultValue : options}
      optionValueKey="id"
      placeholder="Rechercher un navire"
      renderMenu={node => <StyledMenu>{node}</StyledMenu>}
      renderMenuItem={(_, item) => {
        const rsuiteItem = item as RsuiteDataItem
        const vessel = rsuiteItem.optionValue as unknown as Vessel.Identity

        return (
          <VesselSearchItem
            key={vessel.id}
            category={vessel.category}
            flag={vessel.flag}
            immatriculation={vessel.immatriculation}
            imo={vessel.imo}
            mmsi={vessel.mmsi}
            searchQuery={query}
            vesselName={vessel.shipName}
          />
        )
      }}
      size={Size.LARGE}
      value={value}
    />
  )
}

const StyledSearch = styled(Search)<{ $backgroundImageUrl?: string; $optionsWidth?: string }>`
  flex-grow: 1;

  input {
    ${p =>
      p.$backgroundImageUrl
        ? `background-image: url(${p.$backgroundImageUrl});
    background-repeat: no-repeat;
    background-position: 16px center;
    background-size: 26px;
    padding-left: 50px !important;`
        : ''}
  }

  ${p =>
    p.$optionsWidth &&
    `
    :nth-child(3) > div {
    width: ${p.$optionsWidth};
  }`}
`

const StyledMenu = styled.div`
  > div > div {
    border-bottom: 1px solid ${p => p.theme.color.lightGray};
  }
`
