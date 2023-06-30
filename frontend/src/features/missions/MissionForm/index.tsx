import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik } from 'formik'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { MissionForm } from './MissionForm'
import { MissionSchema } from './Schemas'
import { useGetMissionQuery } from '../../../api/missionsAPI'
import { createOrEditMission } from '../../../domain/use_cases/missions/createOrEditMission'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { FormikForm } from '../../../uiMonitor/CustomFormikFields/FormikForm'
import { getIdTyped } from '../../../utils/getIdTyped'
import { getMissionPageRoute } from '../../../utils/getMissionPageRoute'
import { missionFactory } from '../Missions.helpers'

export function Mission() {
  const {
    multiMissions: { selectedMissions },
    sideWindow
  } = useAppSelector(state => state)
  const dispatch = useDispatch()

  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const routeParams = getMissionPageRoute(sideWindow.currentPath)

  const idTyped = useMemo(() => getIdTyped(routeParams?.params?.id), [routeParams?.params?.id])
  const isNewMission = useMemo(() => typeof idTyped === 'string', [idTyped])

  const { data: missionToEdit, isLoading } = useGetMissionQuery(!isNewMission ? idTyped : skipToken)
  const selectedMission = useMemo(
    () => selectedMissions.find(mis => mis.mission.id === idTyped),
    [idTyped, selectedMissions]
  )
  const missionFormikValues = useMemo(() => {
    if (isNewMission) {
      return missionFactory(undefined, idTyped)
    }

    return missionFactory(missionToEdit)
    // to prevent re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idTyped, isNewMission, missionToEdit])

  const handleSubmitForm = values => {
    dispatch(createOrEditMission(values))
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
            isNewMission={isNewMission}
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
