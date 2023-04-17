import { SingleTag } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { missionStatusEnum, missionTypeEnum } from '../../../domain/entities/missions'
import { updateFilters } from '../../../domain/shared_slices/MissionFilters'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function FilterTags() {
  const dispatch = useDispatch()
  const { administrationFilter, seaFrontFilter, statusFilter, typeFilter, unitFilter } = useAppSelector(
    state => state.missionFilters
  )

  const onDeleteTag = (valueToDelete: string, filterKey: string, missionFilter) => {
    const updatedFilter = missionFilter.filter(unit => unit !== valueToDelete)
    dispatch(updateFilters({ key: filterKey, value: updatedFilter }))
  }

  return (
    <StyledContainer>
      {administrationFilter.length > 0 &&
        administrationFilter.map(admin => (
          <SingleTag key={admin} onDelete={() => onDeleteTag(admin, 'administrationFilter', administrationFilter)}>
            {String(`Admin. ${admin}`)}
          </SingleTag>
        ))}
      {unitFilter.length > 0 &&
        unitFilter.map(unit => (
          <SingleTag key={unit} onDelete={() => onDeleteTag(unit, 'unitFilter', unitFilter)}>
            {String(`Unité ${unit}`)}
          </SingleTag>
        ))}
      {typeFilter.length > 0 &&
        typeFilter.map(type => (
          <SingleTag key={type} onDelete={() => onDeleteTag(type, 'statusFilter', statusFilter)}>
            {String(`Type ${missionTypeEnum[type].libelle}`)}
          </SingleTag>
        ))}
      {seaFrontFilter.length > 0 &&
        seaFrontFilter.map(seaFront => (
          <SingleTag key={seaFront} onDelete={() => onDeleteTag(seaFront, 'seaFrontFilter', seaFrontFilter)}>
            {String(`Facade ${seaFront}`)}
          </SingleTag>
        ))}
      {statusFilter.length > 0 &&
        statusFilter.map(status => (
          <SingleTag key={status} onDelete={() => onDeleteTag(status, 'typeFilter', typeFilter)}>
            {String(`Mission ${missionStatusEnum[status].libelle.toLowerCase()}`)}
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
