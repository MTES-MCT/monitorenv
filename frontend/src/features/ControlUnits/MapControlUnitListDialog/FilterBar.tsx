import {
  Filter,
  FormikEffect,
  FormikSelect,
  FormikTextInput,
  Icon,
  Size,
  getOptionsFromIdAndName,
  getOptionsFromLabelledEnum
} from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import { noop } from 'lodash/fp'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useGetAdministrationsQuery } from '../../../api/administrationsAPI'
import { useGetBasesQuery } from '../../../api/basesAPI'
import { ControlUnit } from '../../../domain/entities/controlUnit'

import type { FiltersState } from './types'
import type { Promisable } from 'type-fest'

export type FilterBarProps = {
  onChange: (nextFilters: Array<Filter<ControlUnit.ControlUnit>>) => Promisable<void>
}
export function FilterBar({ onChange }: FilterBarProps) {
  const { data: administrations } = useGetAdministrationsQuery()
  const { data: bases } = useGetBasesQuery()

  const administrationsAsOptions = useMemo(() => getOptionsFromIdAndName(administrations), [administrations])
  const basesAsOptions = useMemo(() => getOptionsFromIdAndName(bases), [bases])
  const typesAsOptions = useMemo(() => getOptionsFromLabelledEnum(ControlUnit.ControlUnitResourceType), [])

  const updateFilters = useCallback(
    (filtersState: FiltersState) => {
      const nextFilters: Array<Filter<ControlUnit.ControlUnit>> = []

      if (filtersState.administrationId) {
        const filter: Filter<ControlUnit.ControlUnit> = controlUnits =>
          controlUnits.filter(controlUnit => controlUnit.administrationId === filtersState.administrationId)

        nextFilters.push(filter)
      }

      // TODO Use a better query matcher (this is temporary).
      if (filtersState.query && filtersState.query.trim().length > 0) {
        const filter: Filter<ControlUnit.ControlUnit> = controlUnits =>
          controlUnits.filter(controlUnit => controlUnit.name.includes(filtersState.query as string))

        nextFilters.push(filter)
      }

      if (filtersState.baseId) {
        const filter: Filter<ControlUnit.ControlUnit> = controlUnits =>
          controlUnits.reduce<ControlUnit.ControlUnit[]>((previousControlUnits, controlUnit) => {
            const matches = controlUnit.controlUnitResources.filter(({ baseId }) => baseId === filtersState.baseId)

            return matches.length > 0 ? [...previousControlUnits, controlUnit] : previousControlUnits
          }, [])

        nextFilters.push(filter)
      }

      if (filtersState.type) {
        const filter: Filter<ControlUnit.ControlUnit> = controlUnits =>
          controlUnits.reduce<ControlUnit.ControlUnit[]>((previousControlUnits, controlUnit) => {
            const matches = controlUnit.controlUnitResources.filter(({ type }) => type === filtersState.type)

            return matches.length > 0 ? [...previousControlUnits, controlUnit] : previousControlUnits
          }, [])

        nextFilters.push(filter)
      }

      onChange(nextFilters)
    },
    [onChange]
  )

  if (!administrationsAsOptions || !basesAsOptions) {
    return <p>Chargement en cours...</p>
  }

  return (
    <Formik initialValues={{}} onSubmit={noop}>
      <Wrapper>
        <FormikEffect onChange={updateFilters} />

        <FormikTextInput
          Icon={Icon.Search}
          isLabelHidden
          isLight
          label="Rechercher une unité"
          name="query"
          placeholder="Rechercher une unité"
          size={Size.LARGE}
        />
        <FormikSelect
          isLabelHidden
          isLight
          label="Administration"
          name="administrationId"
          options={administrationsAsOptions as any}
          placeholder="Administration"
          searchable
        />
        <FormikSelect
          isLabelHidden
          isLight
          label="Type de moyen"
          name="type"
          options={typesAsOptions}
          placeholder="Type de moyen"
          searchable
        />
        <FormikSelect
          isLabelHidden
          isLight
          label="Base du moyen"
          name="baseId"
          options={basesAsOptions as any}
          placeholder="Base du moyen"
          searchable
        />
      </Wrapper>
    </Formik>
  )
}

const Wrapper = styled.div`
  margin-bottom: 32px;

  > .Element-Field {
    &:first-child {
      margin-bottom: 8px;
    }

    &:not(:first-child) {
      margin-top: 8px;
    }
  }
`
