import { CustomSearch, Filter, FormikEffect, FormikTextInput, Icon } from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import { noop } from 'lodash/fp'
import { useCallback } from 'react'
import styled from 'styled-components'

import type { FiltersState } from './types'
import type { Base } from '../../../domain/entities/base/types'

export type FilterBarProps = {
  customSearch: CustomSearch<Base.Base> | undefined
  onChange: (nextFilters: Array<Filter<Base.Base>>) => void
}
export function FilterBar({ customSearch, onChange }: FilterBarProps) {
  const updateFilters = useCallback(
    (filtersState: FiltersState) => {
      const nextFilters: Array<Filter<Base.Base>> = []

      if (customSearch && filtersState.query && filtersState.query.trim().length > 0) {
        const filter: Filter<Base.Base> = () => customSearch.find(filtersState.query as string)

        nextFilters.push(filter)
      }

      onChange(nextFilters)
    },
    [customSearch, onChange]
  )

  return (
    <Formik initialValues={{}} onSubmit={noop}>
      <Wrapper>
        <FormikEffect onChange={updateFilters} />

        <FormikTextInput
          Icon={Icon.Search}
          isLabelHidden
          label="Rechercher..."
          name="query"
          placeholder="Rechercher..."
        />
      </Wrapper>
    </Formik>
  )
}

const Wrapper = styled.div`
  display: flex;
`
