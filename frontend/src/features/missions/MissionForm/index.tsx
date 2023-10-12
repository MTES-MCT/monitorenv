import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik } from 'formik'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { MissionForm } from './MissionForm'
import { MissionSchema } from './Schemas'
import { useGetMissionQuery } from '../../../api/missionsAPI'
import { saveMission } from '../../../domain/use_cases/missions/saveMission'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { FormikForm } from '../../../uiMonitor/CustomFormikFields/FormikForm'
import { getIdTyped } from '../../../utils/getIdTyped'
import { isNewMission } from '../../../utils/isNewMission'
import { getMissionPageRoute } from '../../../utils/routes'
import { missionFactory } from '../Missions.helpers'

export function Mission() {
  const {
    multiMissions: { selectedMissions },
    sideWindow
  } = useAppSelector(state => state)
  const dispatch = useAppDispatch()
  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const routeParams = getMissionPageRoute(sideWindow.currentPath)

  const idTyped = useMemo(() => getIdTyped(routeParams?.params?.id), [routeParams?.params?.id])
  const missionIsNewMission = useMemo(() => isNewMission(routeParams?.params?.id), [routeParams?.params?.id])

  const { data: missionToEdit, isLoading } = useGetMissionQuery(
    !missionIsNewMission && idTyped ? Number(idTyped) : skipToken
  )
  const selectedMission = useMemo(
    () => selectedMissions.find(mis => mis.mission.id === idTyped),
    [idTyped, selectedMissions]
  )

  const missionFormikValues = useMemo(() => {
    if (missionIsNewMission) {
      return missionFactory(undefined, idTyped)
    }

    return missionFactory(missionToEdit)
  }, [idTyped, missionIsNewMission, missionToEdit])

  const handleSubmitForm = values => {
    dispatch(saveMission(values))
  }

  if (isLoading) {
    return <div>Chargement en cours</div>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      <Formik
        key={idTyped}
        enableReinitialize
        initialValues={missionFormikValues}
        onSubmit={handleSubmitForm}
        validateOnBlur={false}
        validateOnChange={shouldValidateOnChange}
        validateOnMount={false}
        validationSchema={MissionSchema}
      >
        <FormikForm>
          <MissionForm
            id={idTyped}
            isAlreadyClosed={missionToEdit?.isClosed}
            isNewMission={missionIsNewMission}
            selectedMission={selectedMission?.mission}
            setShouldValidateOnChange={setShouldValidateOnChange}
          />
        </FormikForm>
      </Formik>
    </EditMissionWrapper>
  )
}

const EditMissionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
