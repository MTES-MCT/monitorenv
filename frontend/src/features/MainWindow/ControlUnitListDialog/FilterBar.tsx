import { FormikEffect, FormikSelect, FormikTextInput, Icon, Size } from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import { noop } from 'lodash/fp'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useGetControlUnitAdministrationsQuery } from '../../../api/controlUnitAdministration'
import { useGetPortsQuery } from '../../../api/port'
import { ControlUnit } from '../../../domain/entities/controlUnit/types'
import { getOptionsFromIdAndName } from '../../../utils/getOptionsFromIdAndName'
import { getOptionsFromLabelledEnum } from '../../../utils/getOptionsFromLabelledEnum'

import type { Filter, FilterFormValues } from './types'
import type { Promisable } from 'type-fest'

export type FilterBarProps = {
  onChange: (nextFilters: Filter[]) => Promisable<void>
}
export function FilterBar({ onChange }: FilterBarProps) {
  const { data: controlUnitAdministrations } = useGetControlUnitAdministrationsQuery()
  const { data: ports } = useGetPortsQuery()

  const controlUnitAdministrationsAsOptions = useMemo(
    () => getOptionsFromIdAndName(controlUnitAdministrations),
    [controlUnitAdministrations]
  )
  const portsAsOptions = useMemo(() => getOptionsFromIdAndName(ports), [ports])
  const typesAsOptions = useMemo(() => getOptionsFromLabelledEnum(ControlUnit.ControlUnitResourceType), [])

  const updateFilters = useCallback(
    (filterFormValues: FilterFormValues) => {
      const nextFilters: Filter[] = []

      if (filterFormValues.controlUnitAdministrationId) {
        const filter: Filter = controlUnits =>
          controlUnits.filter(
            controlUnit => controlUnit.controlUnitAdministrationId === filterFormValues.controlUnitAdministrationId
          )

        nextFilters.push(filter)
      }

      // TODO Use a better query matcher (this is temporary).
      if (filterFormValues.query && filterFormValues.query.trim().length > 0) {
        const filter: Filter = controlUnits =>
          controlUnits.filter(controlUnit => controlUnit.name.includes(filterFormValues.query as string))

        nextFilters.push(filter)
      }

      if (filterFormValues.portId) {
        const filter: Filter = controlUnits =>
          controlUnits.reduce<ControlUnit.ControlUnit[]>((previousControlUnits, controlUnit) => {
            const matches = controlUnit.controlUnitResources.filter(({ portId }) => portId === filterFormValues.portId)

            return matches.length > 0 ? [...previousControlUnits, controlUnit] : previousControlUnits
          }, [])

        nextFilters.push(filter)
      }

      if (filterFormValues.type) {
        const filter: Filter = controlUnits =>
          controlUnits.reduce<ControlUnit.ControlUnit[]>((previousControlUnits, controlUnit) => {
            const matches = controlUnit.controlUnitResources.filter(({ type }) => type === filterFormValues.type)

            return matches.length > 0 ? [...previousControlUnits, controlUnit] : previousControlUnits
          }, [])

        nextFilters.push(filter)
      }

      onChange(nextFilters)
    },
    [onChange]
  )

  if (!controlUnitAdministrationsAsOptions || !portsAsOptions) {
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
          name="controlUnitAdministrationId"
          options={controlUnitAdministrationsAsOptions as any}
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
          name="portId"
          options={portsAsOptions as any}
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
