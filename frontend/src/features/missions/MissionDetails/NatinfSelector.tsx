/* eslint-disable react/jsx-props-no-spreading */
import { useField } from 'formik'
import { MutableRefObject, useRef, useMemo } from 'react'
import { Form, Tag, TagPicker } from 'rsuite'
import styled from 'styled-components'

import { useGetInfractionsQuery } from '../../../api/infractionsAPI'

const sortNatinf = (a, b) => {
  if (a?.natinfCode < b?.natinfCode) {
    return -1
  }
  if (a?.natinfCode > b?.natinfCode) {
    return 1
  }

  return 0
}

export function NatinfSelector({ infractionPath, ...props }) {
  const [natinfField, , natinfHelpers] = useField(`${infractionPath}.natinf`)

  const selectorRef = useRef() as MutableRefObject<HTMLDivElement>
  const { data, isError, isLoading } = useGetInfractionsQuery()
  const sortedData = useMemo(() => data && [...data]?.sort(sortNatinf), [data])
  if (isError) {
    return 'Erreur'
  }
  if (isLoading) {
    return 'Chargement'
  }

  return (
    <SelectorWrapper ref={selectorRef}>
      <Form.ControlLabel htmlFor="natinf">NATINF</Form.ControlLabel>
      <FixedWidthTagPicker
        block
        container={() => selectorRef.current}
        data={sortedData}
        labelKey="natinfCode"
        onChange={natinfHelpers.setValue}
        renderMenuItem={(_, item) => `${item.natinfCode} - ${item.infraction}`}
        renderValue={(_, items) => items?.map(tag => <Tag key={tag.id}>{`${tag.natinfCode} - ${tag.infraction}`}</Tag>)}
        searchable
        value={natinfField.value}
        valueKey="natinfCode"
        virtualized
        {...props}
      />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  position: relative;
  .rs-picker-menu {
  }
`

const FixedWidthTagPicker = styled(TagPicker)`
  max-width: 450px;
`
