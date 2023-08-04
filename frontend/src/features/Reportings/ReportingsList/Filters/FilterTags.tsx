import { SingleTag } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { reportingSourceLabels } from '../../../../domain/entities/reporting'
import { ReportingsFiltersEnum, reportingsFiltersActions } from '../../../../domain/shared_slices/ReportingsFilters'
import { useAppSelector } from '../../../../hooks/useAppSelector'

export function FilterTags() {
  const dispatch = useDispatch()
  const { seaFrontFilter, sourceTypeFilter, subThemesFilter, themeFilter } = useAppSelector(
    state => state.reportingFilters
  )

  const onDeleteTag = (valueToDelete: string, filterKey: ReportingsFiltersEnum, reportingFilter) => {
    const updatedFilter = reportingFilter.filter(unit => unit !== valueToDelete)
    dispatch(reportingsFiltersActions.updateFilters({ key: filterKey, value: updatedFilter }))
  }

  return (
    <StyledContainer>
      {sourceTypeFilter.length > 0 &&
        sourceTypeFilter.map(sourceType => (
          <SingleTag
            key={sourceType}
            onDelete={() => onDeleteTag(sourceType, ReportingsFiltersEnum.SOURCE_TYPE_FILTER, sourceTypeFilter)}
          >
            {String(`Type ${reportingSourceLabels[sourceType].label}`)}
          </SingleTag>
        ))}
      {themeFilter.length > 0 &&
        themeFilter.map(theme => (
          <SingleTag key={theme} onDelete={() => onDeleteTag(theme, ReportingsFiltersEnum.THEME_FILTER, themeFilter)}>
            {String(`Thème ${theme}`)}
          </SingleTag>
        ))}
      {subThemesFilter.length > 0 &&
        subThemesFilter.map(subTheme => (
          <SingleTag
            key={subTheme}
            onDelete={() => onDeleteTag(subTheme, ReportingsFiltersEnum.SUB_THEMES_FILTER, subThemesFilter)}
          >
            {String(`Sous-thème ${subTheme}`)}
          </SingleTag>
        ))}
      {seaFrontFilter.length > 0 &&
        seaFrontFilter.map(seaFront => (
          <SingleTag
            key={seaFront}
            onDelete={() => onDeleteTag(seaFront, ReportingsFiltersEnum.SEA_FRONT_FILTER, seaFrontFilter)}
          >
            {String(`Facade ${seaFront}`)}
          </SingleTag>
        ))}

      {/*
      {typeFilter.length > 0 &&
        typeFilter.map(type => (
          <SingleTag key={type} onDelete={() => onDeleteTag(type, ReportingsFiltersEnum.TYPE_FILTER, typeFilter)}>
            {String(`Type ${missionTypeEnum[type].libelle}`)}
          </SingleTag>
        ))}
   
      {statusFilter.length > 0 &&
        statusFilter.map(status => (
          <SingleTag key={status} onDelete={() => onDeleteTag(status, ReportingsFiltersEnum.STATUS_FILTER, statusFilter)}>
            {String(`Mission ${missionStatusLabels[status].libelle.toLowerCase()}`)}
          </SingleTag>
        ))}
       */}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 16px;
`
