import { SingleTag } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { missionSourceEnum, missionStatusEnum, missionTypeEnum } from '../../../domain/entities/missions'
import { updateFilters } from '../../../domain/shared_slices/MissionFilters'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function FilterTags({ onDeleteAdministration, onDeleteSource, onDeleteUnit }) {
  const dispatch = useDispatch()
  const {
    administrationFilter,
    periodFilter,
    sourceFilter,
    startedAfter,
    startedBefore,
    statusFilter,
    typeFilter,
    unitFilter
  } = useAppSelector(state => state.missionFilters)

  const onDeleteType = (typeToDelete: string) => {
    const updateTypeFilter = typeFilter.filter(type => type !== typeToDelete)
    dispatch(updateFilters({ key: 'typeFilter', value: updateTypeFilter }))
  }
  const onDeleteStatus = (statusToDelete: string) => {
    const updateStatusFilter = statusFilter.filter(status => status !== statusToDelete)
    dispatch(updateFilters({ key: 'statusFilter', value: updateStatusFilter }))
  }

  return (
    <StyledContainer>
      {sourceFilter && (
        <SingleTag onDelete={onDeleteSource}>
          {String(`Ouverte par le ${missionSourceEnum[sourceFilter].label}`)}
        </SingleTag>
      )}

      {administrationFilter && (
        <SingleTag onDelete={onDeleteAdministration}>{String(`Administration ${administrationFilter}`)}</SingleTag>
      )}
      {unitFilter && <SingleTag onDelete={onDeleteUnit}>{String(`Unité ${unitFilter}`)}</SingleTag>}
      {typeFilter.length > 0 &&
        typeFilter.map(type => (
          <SingleTag onDelete={() => onDeleteType(type)}>{String(`Type ${missionTypeEnum[type].libelle}`)}</SingleTag>
        ))}
      {statusFilter.length > 0 &&
        statusFilter.map(status => (
          <SingleTag onDelete={() => onDeleteStatus(status)}>
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
  gap: 5px;
`
