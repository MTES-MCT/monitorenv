import React from 'react'
import { useGetMissionsQuery, useUpdateMissionMutation } from '../../api/missionsAPI'
import { useFormik } from 'formik';
 
export const MissionDetail = ({ id })  => {
  const { mission } = useGetMissionsQuery(undefined, {
    selectFromResult: ({ data }) =>  ({
      mission: data?.find(op => op.id === id),
    }),
  })
  const [
    updateMission,
    { isLoading: isUpdating },
  ] = useUpdateMissionMutation()

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: mission?.id,
      typeMission: mission?.typeMission,
      statusMission: mission?.statusMission,
      facade: mission?.facade,
      theme: mission?.theme,
      inputStartDatetimeUtc: mission?.inputStartDatetimeUtc || '',
      inputEndDatetimeUtc: mission?.inputEndDatetimeUtc || ''
    },
    onSubmit: values => {
      updateMission(values)
    },
  });

  if (id === undefined) {
    return<div style={{flex:1}}>not set yet</div>
  }
  return <div style={{flex:1}}>{JSON.stringify(mission)}
  <div>Is updating ? : {isUpdating}</div>
   <form onSubmit={formik.handleSubmit}>
       <label htmlFor="typeMission">Type Opération</label>
       <input
         id="typeMission"
         type="text"
         {...formik.getFieldProps('typeMission')}
       />
       <label htmlFor="statusMission">Statut Opération</label>
       <input
         id="statusMission"
         type="text"
         {...formik.getFieldProps('statusMission')}
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