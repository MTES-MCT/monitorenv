import React, { useRef } from 'react'
import styled from 'styled-components';
import _ from 'lodash'
import { Cascader } from 'rsuite';
import {  useField } from 'formik';

import { useGetControlTopicsQuery } from '../../../api/controlTopicsAPI'
import { COLORS } from '../../../constants/constants';

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
    <CascaderWrapper ref={cascaderRef} data-cy={'controlTopicsCascader'}>
      <Cascader
        block
        searchable={false}
        container={()=>cascaderRef.current}
        value={value}
        onChange={setValue}
        data={controlTopics}
        menuWidth={300}
        {...props} />
    </CascaderWrapper>
  )
}

const CascaderWrapper = styled.div`
  .rs-picker-cascader-menu-item {
    padding-right: 0;
  }
  .rs-picker-menu {
    position: relative;
    margin-top: -32px;
  }
  .rs-picker-toggle {
    width: calc(100% - 44px);
    background: ${COLORS.white} !important;
  }
`
