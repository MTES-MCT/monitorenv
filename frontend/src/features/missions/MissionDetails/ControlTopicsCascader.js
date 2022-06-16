import React, { useRef } from 'react'
import { Cascader } from 'rsuite';
import {  useField } from 'formik';
import _ from 'lodash'

import { useGetControlTopicsQuery } from '../../../api/controlTopicsAPI'
import styled from 'styled-components';

export const ControlTopicsCascader = ({ name, ...props }) => {
  const [field, , helpers] = useField(name);
  const { value } = field;
  const { setValue } = helpers;

  const cascaderRef = useRef()
  const { data, isError, isLoading } = useGetControlTopicsQuery()
  const controlTopics = _.reduce(data, (acc, val)=> {
      const key = _.findIndex(acc, v => v.value === val.topic_level_1)
      const label = _.trim(`${val.topic_level_2} ${val.topic_level_3 ||''}`)
      if (key >= 0) {
        acc[key].children.push({value: val.id, label})
      } else {
        acc.push({value: val.topic_level_1, label: val.topic_level_1, children: [
          {value: val.id, label}
        ]})
      }
      return acc
  }, [])

  if (isError) {
    return ('Erreur')
  }
  if (isLoading) {
    return ('Chargement')
  }
  return (
    <CascaderWrapper ref={cascaderRef}>
      <Cascader container={()=>cascaderRef.current} value={value} onChange={setValue} data={controlTopics} menuWidth={320} {...props} />
    </CascaderWrapper>
  )
}

const CascaderWrapper = styled.div`
`
