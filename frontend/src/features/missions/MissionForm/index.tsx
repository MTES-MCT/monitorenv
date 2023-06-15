import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { matchPath } from 'react-router-dom'
import styled from 'styled-components'

import { useGetMissionQuery } from '../../../api/missionsAPI'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setIsClosedMission } from '../../../domain/shared_slices/MissionsState'
import { createOrEditMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/createOrEditMission'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { FormikForm } from '../../../uiMonitor/CustomFormikFields/FormikForm'
import { missionFactory } from '../Missions.helpers'
import { MissionForm } from './MissionForm'
import { MissionSchema } from './Schemas'

export function Mission() {
  const { sideWindow } = useAppSelector(state => state)
  const dispatch = useDispatch()
  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const isEditMissionRoute = matchPath<'id', string>(
    {
      end: true,
      path: sideWindowPaths.MISSION
    },
    sideWindow.currentPath
  )

  const id = isEditMissionRoute?.params?.id ? parseInt(isEditMissionRoute?.params?.id, 10) : undefined

  const { data: missionToEdit } = useGetMissionQuery(id ?? skipToken)

  const missionFormikValues = useMemo(() => {
    if (!id) {
      return missionFactory()
    }

    return missionFactory(missionToEdit)
  }, [missionToEdit, id])

  useEffect(() => {
    if (missionToEdit) {
      dispatch(setIsClosedMission(missionToEdit?.isClosed))
    }
  }, [dispatch, missionToEdit])

  const handleSubmitForm = values => {
    dispatch(createOrEditMissionAndGoToMissionsList(values))
  }

  if (id && !missionToEdit) {
    return <div>Chargement en cours</div>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      <Formik
        enableReinitialize
        initialValues={missionFormikValues}
        onSubmit={handleSubmitForm}
        validateOnBlur={false}
        validateOnChange={shouldValidateOnChange}
        validateOnMount={false}
        validationSchema={MissionSchema}
      >
        <FormikForm>
          <MissionForm id={id} mission={missionToEdit} setShouldValidateOnChange={setShouldValidateOnChange} />
        </FormikForm>
      </Formik>
    </EditMissionWrapper>
  )
}

const EditMissionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`
