import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik } from 'formik'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { matchPath } from 'react-router-dom'
import styled from 'styled-components'

import { useGetMissionQuery } from '../../../api/missionsAPI'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { createOrEditMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/createOrEditMission'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MissionSourceTag } from '../../../ui/MissionSourceTag'
import { FormikForm } from '../../../uiMonitor/CustomFormikFields/FormikForm'
import { Header } from '../../SideWindow/Header'
import { missionFactory } from '../Missions.helpers'
import { MissionSchema } from '../MissionSchema'
import { MissionForm } from './MissionForm'

export function Mission() {
  const { sideWindow } = useAppSelector(state => state)
  const dispatch = useDispatch()
  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const routeParams = matchPath<{ id: string }>(sideWindow.currentPath, {
    exact: true,
    path: [sideWindowPaths.MISSION, sideWindowPaths.MISSION_NEW],
    strict: true
  })

  const id = routeParams?.params?.id ? parseInt(routeParams?.params?.id, 10) : undefined

  const { data: missionToEdit } = useGetMissionQuery(id ?? skipToken)

  const missionFormikValues = useMemo(() => {
    if (!id) {
      return missionFactory()
    }

    return missionFactory(missionToEdit)
  }, [missionToEdit, id])

  const handleSubmitForm = values => {
    dispatch(createOrEditMissionAndGoToMissionsList(values))
  }

  if (id && !missionToEdit) {
    return <div>Chargement en cours</div>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      <Header title="Edition de la mission">
        <MissionSourceTag source={missionToEdit?.missionSource} />
      </Header>

      <Formik
        enableReinitialize
        initialValues={missionFormikValues}
        onSubmit={handleSubmitForm}
        validateOnBlur={false}
        validateOnChange={shouldValidateOnChange}
        validateOnMount={false}
        validationSchema={MissionSchema}
      >
        {() => (
          <FormikForm>
            <MissionForm id={id} mission={missionToEdit} setShouldValidateOnChange={setShouldValidateOnChange} />
          </FormikForm>
        )}
      </Formik>
    </EditMissionWrapper>
  )
}

const EditMissionWrapper = styled.div`
  flex: 1;
  max-width: 100vw;
`
