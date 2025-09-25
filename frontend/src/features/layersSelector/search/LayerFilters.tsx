import { useGetAMPsQuery } from '@api/ampsAPI'
import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { Tooltip } from '@components/Tooltip'
import { PeriodFilter } from '@features/VigilanceArea/components/PeriodFilter'
import {
  INITIAL_STATE,
  vigilanceAreaFiltersActions
} from '@features/VigilanceArea/components/VigilanceAreasList/Filters/slice'
import {
  getIsLinkingAMPToVigilanceArea,
  getIsLinkingRegulatoryToVigilanceArea,
  getIsLinkingZonesToVigilanceArea
} from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  Accent,
  CheckPicker,
  CustomSearch,
  type DateAsStringRange,
  DateRangePicker,
  type Option,
  SingleTag
} from '@mtes-mct/monitor-ui'
import { deleteTagTag } from '@utils/deleteTagTag'
import { deleteThemeTag } from '@utils/deleteThemeTag'
import { getAmpsAsOptions } from '@utils/getAmpsAsOptions'
import { Fragment, useMemo } from 'react'
import styled from 'styled-components'

import {
  resetFilters,
  setFilteredAmpTypes,
  setFilteredRegulatoryTags,
  setFilteredRegulatoryThemes,
  setIsAmpSearchResultsVisible,
  setIsRegulatorySearchResultsVisible
} from './slice'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

export function LayerFilters() {
  const dispatch = useAppDispatch()
  const isSuperUser = useAppSelector(state => state.account.isSuperUser)

  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))
  const isLinkingAmpToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const filteredVigilanceAreaPeriod = useAppSelector(state => state.vigilanceAreaFilters.period)

  const { data: amps } = useGetAMPsQuery()
  const ampTypes = useMemo(() => getAmpsAsOptions(amps ?? []), [amps])
  const AMPCustomSearch = useMemo(() => new CustomSearch(ampTypes as Array<Option>, ['label']), [ampTypes])

  const {
    createdBy,
    nbOfFiltersSetted: numberOfVigilanceAreaFiltersSetted,
    seaFronts,
    specificPeriod: vigilanceAreaSpecificPeriodFilter,
    status,
    visibility
  } = useAppSelector(state => state.vigilanceAreaFilters)

  const updateFilteredAmpTypes = nextAmpThemes => {
    dispatch(setFilteredAmpTypes(nextAmpThemes ?? []))
  }
  const deleteAmpType = (ampThemeToDelete: string) => () => {
    if (filteredAmpTypes.length === 1) {
      dispatch(setIsAmpSearchResultsVisible(false))
    }

    dispatch(setFilteredAmpTypes(filteredAmpTypes.filter(theme => theme !== ampThemeToDelete)))
  }

  const deleteRegulatoryTag = (regulatoryTagToDelete: TagOption) => () => {
    if (filteredRegulatoryTags.length === 1) {
      dispatch(setIsRegulatorySearchResultsVisible(false))
    }
    const updatedFilter = deleteTagTag(filteredRegulatoryTags, regulatoryTagToDelete)
    dispatch(setFilteredRegulatoryTags(updatedFilter))
  }

  const deleteRegulatoryTheme = (regulatoryThemeToDelete: ThemeOption) => () => {
    if (filteredRegulatoryThemes.length === 1) {
      dispatch(setIsRegulatorySearchResultsVisible(false))
    }
    const updatedFilter = deleteThemeTag(filteredRegulatoryThemes, regulatoryThemeToDelete)

    dispatch(setFilteredRegulatoryThemes(updatedFilter))
  }

  const updateDateRangeFilter = (dateRange: DateAsStringRange | undefined) => {
    dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'specificPeriod', value: dateRange }))
  }

  const updateVigilanceAreaFilters = <K extends keyof typeof INITIAL_STATE>(key: K, value: typeof INITIAL_STATE[K]) => {
    dispatch(vigilanceAreaFiltersActions.updateFilters({ key, value }))
  }

  const handleResetFilters = () => {
    dispatch(resetFilters())
    dispatch(vigilanceAreaFiltersActions.resetFilters())
  }

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
            onChange={updateFilteredAmpTypes}
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

      {(filteredRegulatoryTags.length > 0 ||
        filteredAmpTypes?.length > 0 ||
        filteredRegulatoryThemes.length > 0 ||
        numberOfVigilanceAreaFiltersSetted > 0) && (
        <TagWrapper>
          {filteredRegulatoryThemes?.map(theme => (
            <Fragment key={`filteredRegulatoryThemes-${theme.id}`}>
              <SingleTag accent={Accent.SECONDARY} onDelete={deleteRegulatoryTheme(theme)} title={theme.name}>
                {theme.name}
              </SingleTag>
              {theme.subThemes?.map(subTheme => (
                <SingleTag
                  key={subTheme.id}
                  accent={Accent.SECONDARY}
                  onDelete={deleteRegulatoryTheme(subTheme)}
                  title={subTheme.name}
                >
                  {subTheme.name}
                </SingleTag>
              ))}
            </Fragment>
          ))}
          {filteredRegulatoryTags?.map(tag => (
            <Fragment key={`filteredRegulatoryTags-${tag.id}`}>
              <SingleTag accent={Accent.SECONDARY} onDelete={deleteRegulatoryTag(tag)} title={tag.name}>
                {tag.name}
              </SingleTag>
              {tag.subTags?.map(subTag => (
                <SingleTag
                  key={subTag.id}
                  accent={Accent.SECONDARY}
                  onDelete={deleteRegulatoryTag(subTag)}
                  title={subTag.name}
                >
                  {subTag.name}
                </SingleTag>
              ))}
            </Fragment>
          ))}

          {filteredAmpTypes?.map(type => (
            <SingleTag key={type} accent={Accent.SECONDARY} onDelete={deleteAmpType(type)} title={type}>
              {type}
            </SingleTag>
          ))}
          {visibility.length === 1 && visibility[0] && (
            <SingleTag
              accent={Accent.SECONDARY}
              onDelete={() => updateVigilanceAreaFilters('visibility', INITIAL_STATE.visibility)}
              title={visibility[0]}
            >
              {VigilanceArea.VisibilityLabel[visibility[0]]}
            </SingleTag>
          )}
          {status.length === 1 && status[0] && (
            <SingleTag
              accent={Accent.SECONDARY}
              onDelete={() => updateVigilanceAreaFilters('status', INITIAL_STATE.status)}
              title={status[0]}
            >
              {VigilanceArea.StatusLabel[status[0]]}
            </SingleTag>
          )}
          {createdBy?.map(creator => (
            <SingleTag
              key={creator}
              accent={Accent.SECONDARY}
              onDelete={() =>
                updateVigilanceAreaFilters(
                  'createdBy',
                  createdBy.filter(c => c !== creator)
                )
              }
              title={creator}
            >
              {creator}
            </SingleTag>
          ))}
          {seaFronts?.map(seaFront => (
            <SingleTag
              key={seaFront}
              accent={Accent.SECONDARY}
              onDelete={() =>
                updateVigilanceAreaFilters(
                  'seaFronts',
                  seaFronts.filter(s => s !== seaFront)
                )
              }
              title={seaFront}
            >
              {seaFront}
            </SingleTag>
          ))}
        </TagWrapper>
      )}

      {(filteredRegulatoryTags.length > 0 ||
        filteredRegulatoryThemes.length > 0 ||
        filteredAmpTypes?.length > 0 ||
        numberOfVigilanceAreaFiltersSetted > 0) && (
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
  margin-bottom: 0;
`
const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`
const ResetFilters = styled.div`
  color: ${p => p.theme.color.slateGray};
  cursor: pointer;
  display: flex;
  padding: 0;
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
