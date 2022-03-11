import React, {useState} from 'react'
import { OperationsList } from './OperationsList'
import { OperationDetail } from './OperationDetail'

export const OperationsWrapper = () => {
  const  [operationId, setOperationId] = useState(null)
  return (<div style={{display: "flex", flexDirection:'column', flex:1}}>
  <OperationsList setOperation={setOperationId}></OperationsList>
  <OperationDetail id={operationId}></OperationDetail>
  </div>)
}