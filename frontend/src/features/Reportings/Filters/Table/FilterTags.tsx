import { Accent, SingleTag } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { reportingSourceLabels } from '../../../../domain/entities/reporting'
import { ReportingsFiltersEnum, reportingsFiltersActions } from '../../../../domain/shared_slices/ReportingsFilters'
import { useAppSelector } from '../../../../hooks/useAppSelector'

export function FilterTags() {
  const dispatch = useDispatch()
  const { seaFrontFilter, sourceFilter, sourceTypeFilter, subThemesFilter, themeFilter } = useAppSelector(
    state => state.reportingFilters
  )

  const onDeleteTag = (valueToDelete: string | any, filterKey: ReportingsFiltersEnum, reportingFilter) => {
    const updatedFilter = reportingFilter.filter(unit => unit !== valueToDelete)
    dispatch(reportingsFiltersActions.updateFilters({ key: filterKey, value: updatedFilter }))
  }
  const hasNoFilterTags =
    sourceTypeFilter.length === 0 ||
    sourceFilter.length === 0 ||
    themeFilter.length === 0 ||
    subThemesFilter.length === 0 ||
    seaFrontFilter.length === 0

  if (hasNoFilterTags) {
    return null
  }

  return (
    <StyledContainer>
      {sourceTypeFilter.length > 0 &&
        sourceTypeFilter.map(sourceType => (
          <SingleTag
            key={sourceType}
            accent={Accent.SECONDARY}
            onDelete={() => onDeleteTag(sourceType, ReportingsFiltersEnum.SOURCE_TYPE_FILTER, sourceTypeFilter)}
          >
            {String(`Type ${reportingSourceLabels[sourceType].label}`)}
          </SingleTag>
        ))}
      {sourceFilter.length > 0 &&
        sourceFilter.map(source => (
          <SingleTag
            key={`${source.id}-${source.label}`}
            accent={Accent.SECONDARY}
            onDelete={() => onDeleteTag(source, ReportingsFiltersEnum.SOURCE_FILTER, sourceFilter)}
          >
            {String(`Source ${source.label}`)}
          </SingleTag>
        ))}
      {themeFilter.length > 0 &&
        themeFilter.map(theme => (
          <SingleTag
            key={theme}
            accent={Accent.SECONDARY}
            onDelete={() => onDeleteTag(theme, ReportingsFiltersEnum.THEME_FILTER, themeFilter)}
          >
            {String(`Thème ${theme}`)}
          </SingleTag>
        ))}
      {subThemesFilter.length > 0 &&
        subThemesFilter.map(subTheme => (
          <SingleTag
            key={subTheme}
            accent={Accent.SECONDARY}
            onDelete={() => onDeleteTag(subTheme, ReportingsFiltersEnum.SUB_THEMES_FILTER, subThemesFilter)}
          >
            {String(`Sous-thème ${subTheme}`)}
          </SingleTag>
        ))}
      {seaFrontFilter.length > 0 &&
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
`
