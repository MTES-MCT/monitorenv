import { SingleTag } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { missionStatusLabels, missionTypeEnum } from '../../../../domain/entities/missions'
import { MissionFiltersEnum, updateFilters } from '../../../../domain/shared_slices/MissionFilters'
import { useAppSelector } from '../../../../hooks/useAppSelector'

export function FilterTags() {
  const dispatch = useDispatch()
  const { administrationFilter, seaFrontFilter, statusFilter, themeFilter, typeFilter, unitFilter } = useAppSelector(
    state => state.missionFilters
  )

  const onDeleteTag = (valueToDelete: string, filterKey: MissionFiltersEnum, missionFilter) => {
    const updatedFilter = missionFilter.filter(unit => unit !== valueToDelete)
    dispatch(updateFilters({ key: filterKey, value: updatedFilter }))
  }

  return (
    <StyledContainer>
      {administrationFilter.length > 0 &&
        administrationFilter.map(admin => (
          <SingleTag
            key={admin}
            onDelete={() => onDeleteTag(admin, MissionFiltersEnum.ADMINISTRATION_FILTER, administrationFilter)}
          >
            {String(`Admin. ${admin}`)}
          </SingleTag>
        ))}
      {unitFilter.length > 0 &&
        unitFilter.map(unit => (
          <SingleTag key={unit} onDelete={() => onDeleteTag(unit, MissionFiltersEnum.UNIT_FILTER, unitFilter)}>
            {String(`Unité ${unit}`)}
          </SingleTag>
        ))}
      {typeFilter.length > 0 &&
        typeFilter.map(type => (
          <SingleTag key={type} onDelete={() => onDeleteTag(type, MissionFiltersEnum.TYPE_FILTER, typeFilter)}>
            {String(`Type ${missionTypeEnum[type].libelle}`)}
          </SingleTag>
        ))}
      {seaFrontFilter.length > 0 &&
        seaFrontFilter.map(seaFront => (
          <SingleTag
            key={seaFront}
            onDelete={() => onDeleteTag(seaFront, MissionFiltersEnum.SEA_FRONT_FILTER, seaFrontFilter)}
          >
            {String(`Facade ${seaFront}`)}
          </SingleTag>
        ))}
      {statusFilter.length > 0 &&
        statusFilter.map(status => (
          <SingleTag key={status} onDelete={() => onDeleteTag(status, MissionFiltersEnum.STATUS_FILTER, statusFilter)}>
            {String(`Mission ${missionStatusLabels[status].libelle.toLowerCase()}`)}
          </SingleTag>
        ))}
      {themeFilter.length > 0 &&
        themeFilter.map(theme => (
          <SingleTag key={theme} onDelete={() => onDeleteTag(theme, MissionFiltersEnum.THEME_FILTER, themeFilter)}>
            {String(`Thème ${theme}`)}
          </SingleTag>
        ))}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 16px;
`
