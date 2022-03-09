import React from 'react'
import { useGetOperationsQuery, useUpdateOperationMutation } from '../../../api/operationsApi'
import { useFormik } from 'formik';
 
export const OperationDetail = ({ id })  => {
  const { operation } = useGetOperationsQuery(undefined, {
    selectFromResult: ({ data }) =>  ({
      operation: data?.find(op => op.id === id),
    }),
  })
  const [
    updateOperation,
    { isLoading: isUpdating },
  ] = useUpdateOperationMutation()

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: operation?.id,
      typeOperation: operation?.typeOperation,
      statusOperation: operation?.statusOperation,
      facade: operation?.facade,
      theme: operation?.theme,
      inputStartDatetimeUtc: operation?.inputStartDatetimeUtc || '',
      inputEndDatetimeUtc: operation?.inputEndDatetimeUtc || ''
    },
    onSubmit: values => {
      updateOperation(values)
    },
  });

  if (id === undefined) {
    return<div style={{flex:1}}>not set yet</div>
  }
  return <div style={{flex:1}}>{JSON.stringify(operation)}
  <div>Is updating ? : {isUpdating}</div>
   <form onSubmit={formik.handleSubmit}>
       <label htmlFor="typeOperation">Type Opération</label>
       <input
         id="typeOperation"
         type="text"
         {...formik.getFieldProps('typeOperation')}
       />
       <label htmlFor="statusOperation">Statut Opération</label>
       <input
         id="statusOperation"
         type="text"
         {...formik.getFieldProps('statusOperation')}
       />
       <label htmlFor="facade">Façade</label>
       <input
         id="facade"
         type="text"
         {...formik.getFieldProps('facade')}
       />
       <label htmlFor="theme">theme</label>
       <input
         id="theme"
         type="text"
         {...formik.getFieldProps('theme')}
       />
       <label htmlFor="inputStartDatetimeUtc">Début</label>
       <input
         id="inputStartDatetimeUtc"
         type="datetime-local"
         {...formik.getFieldProps('inputStartDatetimeUtc')}
         />
       <label htmlFor="inputEndDatetimeUtc">Fin</label>
       <input
         id="inputEndDatetimeUtc"
         type="datetime-local"
         {...formik.getFieldProps('inputEndDatetimeUtc')}
       />
 
       <button type="submit">Sauvegarder</button>
     </form>
  </div>
}