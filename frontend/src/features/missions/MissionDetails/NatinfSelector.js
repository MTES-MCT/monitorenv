import { useField } from 'formik'
import React, { useRef } from 'react'
import { Form, Tag, TagPicker } from 'rsuite'
import styled from 'styled-components'

import { useGetInfractionsQuery } from '../../../api/infractionsAPI'

export function NatinfSelector({ infractionPath, ...props }) {
  const [natinfField, , natinfHelpers] = useField(`${infractionPath}.natinf`)

  const selectorRef = useRef()
  const { data, isError, isLoading } = useGetInfractionsQuery()

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
        data={data}
        labelKey="natinf_code"
        onChange={natinfHelpers.setValue}
        renderMenuItem={(label, item) => <>{`${item.natinf_code} - ${item.infraction}`}</>}
        renderValue={(values, items) =>
          items?.map((tag, index) => <Tag key={index}>{`${tag.natinf_code} - ${tag.infraction}`}</Tag>)
        }
        // sort={()=>(a,b) => {
        //   return a?.natinf_code < b?.natinf_code ? -1 : a?.natinf_code > b?.natinf_code ? 1 : 0;
        // }}
        searchable
        value={natinfField.value}
        valueKey="natinf_code"
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
