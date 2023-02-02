/* eslint-disable react/jsx-props-no-spreading */
import { useField } from 'formik'
import { MutableRefObject, useRef, useMemo } from 'react'
import { Form, Tag, TagPicker } from 'rsuite'
import styled from 'styled-components'

import { useGetInfractionsQuery } from '../../../../../../api/infractionsAPI'
import { COLORS } from '../../../../../../constants/constants'

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
  const [natinfField, meta, natinfHelpers] = useField(`${infractionPath}.natinf`)

  const selectorRef = useRef() as MutableRefObject<HTMLDivElement>
  const { data, isError, isLoading } = useGetInfractionsQuery()
  const sortedData = useMemo(() => data && [...data]?.sort(sortNatinf), [data])
  if (isError) {
    return <div>Erreur</div>
  }
  if (isLoading) {
    return <div>Chargement</div>
  }

  return (
    <SelectorWrapper ref={selectorRef} error={!!meta.error}>
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

const SelectorWrapper = styled.div<{ error: boolean }>`
  > label {
    ${p => (p.error ? `color: ${COLORS.maximumRed};` : '')}
  }
  .rs-picker-block {
    ${p => (p.error ? `border: 1px solid ${COLORS.maximumRed};` : '')}
  }
  position: relative;
  .rs-picker-menu {
  }
`

const FixedWidthTagPicker = styled(TagPicker)`
  max-width: 450px;
`
