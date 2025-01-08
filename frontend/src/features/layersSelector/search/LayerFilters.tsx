import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { Tooltip } from '@components/Tooltip'
import { PeriodFilter } from '@features/VigilanceArea/components/PeriodFilter'
import {
  getIsLinkingAMPToVigilanceArea,
  getIsLinkingRegulatoryToVigilanceArea,
  getIsLinkingZonesToVigilanceArea
} from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import {
  type DateAsStringRange,
  type Option,
  Accent,
  CheckPicker,
  CustomSearch,
  DateRangePicker,
  SingleTag
} from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { setIsAmpSearchResultsVisible, setIsRegulatorySearchResultsVisible } from './slice'

type LayerFiltersProps = {
  ampTypes: Option<string>[]
  filteredAmpTypes: string[]
  filteredRegulatoryThemes: string[]
  filteredVigilanceAreaPeriod: string | undefined
  handleResetFilters: () => void
  setFilteredAmpTypes: (filteredAmpTypes: string[]) => void
  setFilteredRegulatoryThemes: (filteredRegulatoryThemes: string[]) => void
  updateDateRangeFilter: (dateRange: DateAsStringRange | undefined) => void
}
export function LayerFilters({
  ampTypes,
  filteredAmpTypes,
  filteredRegulatoryThemes,
  filteredVigilanceAreaPeriod,
  handleResetFilters,
  setFilteredAmpTypes,
  setFilteredRegulatoryThemes,
  updateDateRangeFilter
}: LayerFiltersProps) {
  const dispatch = useAppDispatch()
  const { data: user } = useGetCurrentUserAuthorizationQueryOverride()
  const isSuperUser = user?.isSuperUser

  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))
  const isLinkingAmpToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)

  const handleSetFilteredAmpTypes = nextAmpThemes => {
    setFilteredAmpTypes(nextAmpThemes ?? [])
  }
  const handleDeleteAmpType = (ampThemeToDelete: string) => () => {
    if (filteredAmpTypes.length === 1) {
      dispatch(setIsAmpSearchResultsVisible(false))
    }
    setFilteredAmpTypes(filteredAmpTypes.filter(theme => theme !== ampThemeToDelete))
  }

  const handleDeleteRegulatoryTheme = (regulatoryThemeToDelete: string) => () => {
    if (filteredRegulatoryThemes.length === 1) {
      dispatch(setIsRegulatorySearchResultsVisible(false))
    }
    setFilteredRegulatoryThemes(filteredRegulatoryThemes.filter(theme => theme !== regulatoryThemeToDelete))
  }

  const AMPCustomSearch = useMemo(() => new CustomSearch(ampTypes as Array<Option>, ['label']), [ampTypes])

  return (
    <FiltersWrapper>
      {!isLinkingAmpToVigilanceArea && (
        <SelectContainer>
          <RegulatoryThemesFilter style={{ flex: 1 }} />
          <Tooltip>
            Ce champ est utilisé comme critère de recherche dans les zones réglementaire et les zones de vigilance.
          </Tooltip>
        </SelectContainer>
      )}

      {!isLinkingRegulatoryToVigilanceArea && (
        <SelectContainer>
          <StyledCheckPicker
            key={String(ampTypes.length)}
            customSearch={AMPCustomSearch}
            isLabelHidden
            isTransparent
            label="Type d'AMP"
            name="ampTypes"
            onChange={handleSetFilteredAmpTypes}
            options={ampTypes}
            placeholder="Type d'AMP"
            renderValue={() =>
              filteredAmpTypes && <OptionValue>{`Type d'AMP (${filteredAmpTypes.length})`}</OptionValue>
            }
            value={filteredAmpTypes}
          />

          <Tooltip>Ce champ est utilisé comme critère de recherche uniquement pour les AMP.</Tooltip>
        </SelectContainer>
      )}

      {isSuperUser && !isLinkingZonesToVigilanceArea && (
        <SelectContainer>
          <PeriodFilter style={{ flex: 1 }} />

          <Tooltip>Ce champ est utilisé uniquement comme critère de recherche pour les zones de vigilance.</Tooltip>
        </SelectContainer>
      )}
      {filteredVigilanceAreaPeriod === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD && (
        <DateRangePicker
          key="dateRange"
          defaultValue={
            vigilanceAreaSpecificPeriodFilter ? (vigilanceAreaSpecificPeriodFilter as DateAsStringRange) : undefined
          }
          isLabelHidden
          isStringDate
          label="Période spécifique"
          name="dateRange"
          onChange={updateDateRangeFilter}
        />
      )}

      {(filteredRegulatoryThemes?.length > 0 || filteredAmpTypes?.length > 0) && (
        <TagWrapper>
          {filteredRegulatoryThemes?.map(theme => (
            <SingleTag
              key={theme}
              accent={Accent.SECONDARY}
              onDelete={handleDeleteRegulatoryTheme(theme)}
              title={theme}
            >
              {theme}
            </SingleTag>
          ))}

          {filteredAmpTypes?.map(type => (
            <SingleTag key={type} accent={Accent.SECONDARY} onDelete={handleDeleteAmpType(type)} title={type}>
              {type}
            </SingleTag>
          ))}
        </TagWrapper>
      )}
      {(filteredRegulatoryThemes?.length > 0 ||
        filteredAmpTypes?.length > 0 ||
        filteredVigilanceAreaPeriod !== VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS) && (
        <ResetFilters onClick={handleResetFilters}>Réinitialiser les filtres</ResetFilters>
      )}
    </FiltersWrapper>
  )
}

const FiltersWrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  border-top: 2px solid ${p => p.theme.color.lightGray};
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  text-align: left;
`
const TagWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`
const ResetFilters = styled.div`
  color: ${p => p.theme.color.slateGray};
  cursor: pointer;
  display: flex;
  padding: 0px;
  text-decoration: underline;
`

const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const StyledCheckPicker = styled(CheckPicker)`
  flex: 1;
`

const SelectContainer = styled.div`
  align-items: end;
  display: flex;
  gap: 8px;
`
