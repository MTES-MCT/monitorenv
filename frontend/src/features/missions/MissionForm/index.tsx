import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik, Form } from 'formik'
import { noop } from 'lodash'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { MissionForm } from './MissionForm'
import { MissionSchema } from './Schemas'
import { useGetMissionState } from '../../../api/missionsAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { usePreviousNotNull } from '../../../hooks/usePreviousNotNull'
import { getIdTyped } from '../../../utils/getIdTyped'
import { isNewMission } from '../../../utils/isNewMission'
import { getMissionPageRoute } from '../../../utils/routes'
import { missionFactory } from '../Missions.helpers'

export function Mission() {
  const selectedMissions = useAppSelector(state => state.multiMissions.selectedMissions)
  const sideWindow = useAppSelector(state => state.sideWindow)
  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const routeParams = getMissionPageRoute(sideWindow.currentPath)

  const missionId = useMemo(() => getIdTyped(routeParams?.params?.id), [routeParams?.params?.id])
  const missionIsNewMission = useMemo(() => isNewMission(routeParams?.params?.id), [routeParams?.params?.id])

  const { data: missionToEdit, isLoading } = useGetMissionState(
    !missionIsNewMission && missionId ? Number(missionId) : skipToken
  )
  const previousMissionToEdit = usePreviousNotNull(missionToEdit)

  const selectedMission = useMemo(
    () => selectedMissions.find(mis => mis.mission.id === missionId),
    [missionId, selectedMissions]
  )

  const missionFormikValues = useMemo(() => {
    if (missionIsNewMission) {
      return missionFactory(undefined, missionId)
    }

    // The RTK-Query cache has been invalidated so `missionToEdit` is set as `undefined`
    // We must save the previous non-undefined value in memory
    if (previousMissionToEdit && !missionToEdit) {
      return missionFactory(previousMissionToEdit)
    }

    return missionFactory(missionToEdit)
  }, [missionId, missionIsNewMission, missionToEdit, previousMissionToEdit])

  if (isLoading) {
    return <div>Chargement en cours</div>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      <Formik
        key={missionId}
        enableReinitialize
        initialValues={missionFormikValues}
        onSubmit={noop}
        validateOnBlur={false}
        validateOnChange={shouldValidateOnChange}
        validateOnMount={false}
        validationSchema={MissionSchema}
      >
        <Form className="rs-form rs-form-vertical rs-form-fixed-width">
          <MissionForm
            id={missionId}
            isNewMission={missionIsNewMission}
            selectedMission={selectedMission?.mission}
            setShouldValidateOnChange={setShouldValidateOnChange}
          />
        </Form>
      </Formik>
    </EditMissionWrapper>
  )
}

const EditMissionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
