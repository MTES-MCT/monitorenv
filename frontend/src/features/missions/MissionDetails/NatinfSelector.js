import React, { useRef } from 'react'
import styled from 'styled-components'
import { Form, Tag, TagPicker } from 'rsuite'
import {  useField } from 'formik'

import { useGetInfractionsQuery } from '../../../api/infractionsAPI'


export const NatinfSelector = ({ infractionPath, ...props }) => {
  const [natinfField, , natinfHelpers] = useField(`${infractionPath}.natinf`)
  
  const selectorRef = useRef()
  const { data, isError, isLoading } = useGetInfractionsQuery()

  if (isError) {
    return ('Erreur')
  }
  if (isLoading) {
    return ('Chargement')
  }
  return (
    <SelectorWrapper ref={selectorRef}>
        <Form.ControlLabel htmlFor="natinf">NATINF</Form.ControlLabel>
        <TagPicker
          virtualized
          block
          searchable
          container={()=>selectorRef.current}
          value={natinfField.value}
          onChange={natinfHelpers.setValue}
          data={data}
          // sort={()=>(a,b) => {
          //   return a?.natinf_code < b?.natinf_code ? -1 : a?.natinf_code > b?.natinf_code ? 1 : 0;
          // }}
          labelKey={'natinf_code'}
          valueKey={'natinf_code'}
          renderMenuItem={(label, item)=> {
            return (<>{`${item.natinf_code} - ${item.infraction}`}</>)
          }}
          renderValue={(values, items)=> {
            return items?.map((tag,index)=> (<Tag key={index}>{`${tag.natinf_code} - ${tag.infraction}`}</Tag>))
          }}
          {...props} />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  position: relative;
  .rs-picker-menu {
  }
`
