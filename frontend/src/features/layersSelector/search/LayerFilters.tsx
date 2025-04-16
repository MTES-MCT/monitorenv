import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { Tooltip } from '@components/Tooltip'
import { filterSubTags } from '@features/Tags/useCases/getTagsAsOptions'
import { filterSubThemes } from '@features/Themes/useCases/getThemesAsOptions'
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

import type { TagAPI } from 'domain/entities/tags'
import type { ThemeAPI } from 'domain/entities/themes'

type LayerFiltersProps = {
  ampTypes: Option<string>[]
  filteredAmpTypes: string[]
  filteredRegulatoryTags: TagAPI[]
  filteredRegulatoryThemes: ThemeAPI[]
  filteredVigilanceAreaPeriod: string | undefined
  handleResetFilters: () => void
  setFilteredAmpTypes: (filteredAmpTypes: string[]) => void
  setFilteredRegulatoryTags: (filteredRegulatoryTags: TagAPI[]) => void
  setFilteredRegulatoryThemes: (filteredRegulatoryThemes: ThemeAPI[]) => void
  updateDateRangeFilter: (dateRange: DateAsStringRange | undefined) => void
}
export function LayerFilters({
  ampTypes,
  filteredAmpTypes,
  filteredRegulatoryTags,
  filteredRegulatoryThemes,
  filteredVigilanceAreaPeriod,
  handleResetFilters,
  setFilteredAmpTypes,
  setFilteredRegulatoryTags,
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

  const handleDeleteRegulatoryTag = (regulatoryTagToDelete: TagAPI) => () => {
    if (filteredRegulatoryTags.length === 1) {
      dispatch(setIsRegulatorySearchResultsVisible(false))
    }
    const updatedFilter: TagAPI[] = filteredRegulatoryTags
      .map(tag => filterSubTags(tag, regulatoryTagToDelete.id))
      .filter(tag => tag?.id !== regulatoryTagToDelete.id)
      .filter(tag => tag !== undefined)

    setFilteredRegulatoryTags(updatedFilter)
  }

  const handleDeleteRegulatoryTheme = (regulatoryThemeToDelete: ThemeAPI) => () => {
    if (filteredRegulatoryThemes.length === 1) {
      dispatch(setIsRegulatorySearchResultsVisible(false))
    }
    const updatedFilter: ThemeAPI[] = filteredRegulatoryThemes
      .map(theme => filterSubThemes(theme, regulatoryThemeToDelete.id))
      .filter(theme => theme?.id !== regulatoryThemeToDelete.id)
      .filter(theme => theme !== undefined)

    setFilteredRegulatoryThemes(updatedFilter)
  }

  const AMPCustomSearch = useMemo(() => new CustomSearch(ampTypes as Array<Option>, ['label']), [ampTypes])

  return (
    <FiltersWrapper>
      {!isLinkingAmpToVigilanceArea && (
        <>
          <SelectContainer>
            <RegulatoryThemesFilter style={{ flex: 1 }} />
            <Tooltip>
              Ce champ est utilisé comme critère de recherche dans les zones réglementaire et les zones de vigilance.
            </Tooltip>
          </SelectContainer>
          <SelectContainer>
            <RegulatoryTagsFilter style={{ flex: 1 }} />
            <Tooltip>
              Ce champ est utilisé comme critère de recherche dans les zones réglementaire et les zones de vigilance.
            </Tooltip>
          </SelectContainer>
        </>
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

      {(filteredRegulatoryTags.length > 0 || filteredAmpTypes?.length > 0 || filteredRegulatoryThemes.length > 0) && (
        <TagWrapper>
          {filteredRegulatoryThemes?.map(theme => (
            <>
              <SingleTag
                key={theme.id}
                accent={Accent.SECONDARY}
                onDelete={handleDeleteRegulatoryTheme(theme)}
                title={theme.name}
              >
                {theme.name}
              </SingleTag>
              {theme.subThemes.map(subTheme => (
                <SingleTag
                  key={subTheme.id}
                  accent={Accent.SECONDARY}
                  onDelete={handleDeleteRegulatoryTheme(subTheme)}
                  title={subTheme.name}
                >
                  {subTheme.name}
                </SingleTag>
              ))}
            </>
          ))}
          {filteredRegulatoryTags?.map(tag => (
            <>
              <SingleTag
                key={tag.id}
                accent={Accent.SECONDARY}
                onDelete={handleDeleteRegulatoryTag(tag)}
                title={tag.name}
              >
                {tag.name}
              </SingleTag>
              {tag.subTags.map(subTag => (
                <SingleTag
                  key={subTag.id}
                  accent={Accent.SECONDARY}
                  onDelete={handleDeleteRegulatoryTag(subTag)}
                  title={subTag.name}
                >
                  {subTag.name}
                </SingleTag>
              ))}
            </>
          ))}

          {filteredAmpTypes?.map(type => (
            <SingleTag key={type} accent={Accent.SECONDARY} onDelete={handleDeleteAmpType(type)} title={type}>
              {type}
            </SingleTag>
          ))}
        </TagWrapper>
      )}
      {(filteredRegulatoryTags?.length > 0 ||
        filteredAmpTypes?.length > 0 ||
        filteredVigilanceAreaPeriod !== VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS) && (
        <ResetFilters onClick={handleResetFilters}>Réinitialiser les filtres</ResetFilters>
      )}
    </FiltersWrapper>
  )
}

const FiltersWrapper = styled.ul`
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

const SelectContainer = styled.li`
  align-items: end;
  display: flex;
  gap: 8px;
`
