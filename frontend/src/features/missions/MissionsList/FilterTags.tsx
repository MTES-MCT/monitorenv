import { SingleTag } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { missionStatusEnum, missionTypeEnum } from '../../../domain/entities/missions'
import { updateFilters } from '../../../domain/shared_slices/MissionFilters'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function FilterTags() {
  const dispatch = useDispatch()
  const { administrationFilter, statusFilter, typeFilter, unitFilter } = useAppSelector(state => state.missionFilters)

  const onDeleteType = (typeToDelete: string) => {
    const updateTypeFilter = typeFilter.filter(type => type !== typeToDelete)
    dispatch(updateFilters({ key: 'typeFilter', value: updateTypeFilter }))
  }
  const onDeleteStatus = (statusToDelete: string) => {
    const updateStatusFilter = statusFilter.filter(status => status !== statusToDelete)
    dispatch(updateFilters({ key: 'statusFilter', value: updateStatusFilter }))
  }
  const onDeleteAdmin = (adminToDelete: string) => {
    const updateAdminFilter = administrationFilter.filter(admin => admin !== adminToDelete)
    dispatch(updateFilters({ key: 'administrationFilter', value: updateAdminFilter }))
  }

  const onDeleteUnit = (unitToDelete: string) => {
    const updateUnitnFilter = unitFilter.filter(unit => unit !== unitToDelete)
    dispatch(updateFilters({ key: 'unitFilter', value: updateUnitnFilter }))
  }

  return (
    <StyledContainer>
      {administrationFilter.length > 0 &&
        administrationFilter.map(admin => (
          <SingleTag key={admin} onDelete={() => onDeleteAdmin(admin)}>
            {String(`Admin. ${admin}`)}
          </SingleTag>
        ))}
      {unitFilter.length > 0 &&
        unitFilter.map(unit => (
          <SingleTag key={unit} onDelete={() => onDeleteUnit(unit)}>
            {String(`Unité ${unit}`)}
          </SingleTag>
        ))}
      {typeFilter.length > 0 &&
        typeFilter.map(type => (
          <SingleTag key={type} onDelete={() => onDeleteType(type)}>
            {String(`Type ${missionTypeEnum[type].libelle}`)}
          </SingleTag>
        ))}
      {statusFilter.length > 0 &&
        statusFilter.map(status => (
          <SingleTag key={status} onDelete={() => onDeleteStatus(status)}>
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
