import { Accent, SingleTag } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingSourceLabels } from '../../../../domain/entities/reporting'
import { ReportingTargetTypeLabels } from '../../../../domain/entities/targetType'
import { ReportingsFiltersEnum, reportingsFiltersActions } from '../../../../domain/shared_slices/ReportingsFilters'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetControlPlans } from '../../../../hooks/useGetControlPlans'

export function FilterTags() {
  const { subThemes, themes } = useGetControlPlans()
  const dispatch = useAppDispatch()
  const { hasFilters, seaFrontFilter, sourceFilter, sourceTypeFilter, subThemesFilter, targetTypeFilter, themeFilter } =
    useAppSelector(state => state.reportingFilters)

  const onDeleteTag = (valueToDelete: string | any, filterKey: ReportingsFiltersEnum, reportingFilter) => {
    const updatedFilter = reportingFilter.filter(unit => unit !== valueToDelete)
    dispatch(
      reportingsFiltersActions.updateFilters({
        key: filterKey,
        value: updatedFilter.length === 0 ? undefined : updatedFilter
      })
    )
  }

  if (!hasFilters) {
    return null
  }

  return (
    <StyledContainer data-cy="reportings-filter-tags">
      {sourceTypeFilter &&
        sourceTypeFilter.length > 0 &&
        sourceTypeFilter.map(sourceType => (
          <SingleTag
            key={sourceType}
            accent={Accent.SECONDARY}
            onDelete={() => onDeleteTag(sourceType, ReportingsFiltersEnum.SOURCE_TYPE_FILTER, sourceTypeFilter)}
          >
            {String(`Type ${ReportingSourceLabels[sourceType]}`)}
          </SingleTag>
        ))}
      {sourceFilter &&
        sourceFilter.length > 0 &&
        sourceFilter.map(source => (
          <SingleTag
            key={`${source.id}-${source.label}`}
            accent={Accent.SECONDARY}
            onDelete={() => onDeleteTag(source, ReportingsFiltersEnum.SOURCE_FILTER, sourceFilter)}
          >
            {String(`Source ${source.label}`)}
          </SingleTag>
        ))}
      {targetTypeFilter &&
        targetTypeFilter.length > 0 &&
        targetTypeFilter.map(targetType => (
          <SingleTag
            key={targetType}
            accent={Accent.SECONDARY}
            onDelete={() => onDeleteTag(targetType, ReportingsFiltersEnum.TARGET_TYPE_FILTER, targetTypeFilter)}
          >
            {String(`Cible ${ReportingTargetTypeLabels[targetType]}`)}
          </SingleTag>
        ))}
      {themeFilter &&
        themeFilter.length > 0 &&
        themeFilter.map(themeId => (
          <SingleTag
            key={themeId}
            accent={Accent.SECONDARY}
            onDelete={() => onDeleteTag(themeId, ReportingsFiltersEnum.THEME_FILTER, themeFilter)}
          >
            {String(`Thème ${themes[themeId]?.theme}`)}
          </SingleTag>
        ))}
      {subThemesFilter &&
        subThemesFilter?.length > 0 &&
        subThemesFilter.map(subThemeId => (
          <SingleTag
            key={subThemeId}
            accent={Accent.SECONDARY}
            onDelete={() => onDeleteTag(subThemeId, ReportingsFiltersEnum.SUB_THEMES_FILTER, subThemesFilter)}
          >
            {String(`Sous-thème ${subThemes[subThemeId]?.subTheme}`)}
          </SingleTag>
        ))}
      {seaFrontFilter &&
        seaFrontFilter.length > 0 &&
        seaFrontFilter.map(seaFront => (
          <SingleTag
            key={seaFront}
            accent={Accent.SECONDARY}
            onDelete={() => onDeleteTag(seaFront, ReportingsFiltersEnum.SEA_FRONT_FILTER, seaFrontFilter)}
          >
            {String(`Facade ${seaFront}`)}
          </SingleTag>
        ))}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 2px;
  flex-wrap: wrap;
`
