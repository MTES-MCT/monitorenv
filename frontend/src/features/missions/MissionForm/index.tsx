import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik, Form } from 'formik'
import { noop } from 'lodash'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { MissionForm } from './MissionForm'
import { MissionSchema } from './Schemas'
import { useGetMissionQuery } from '../../../api/missionsAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { isNewMission } from '../../../utils/isNewMission'
import { missionFactory } from '../Missions.helpers'

import type { Mission as MissionType, NewMission } from '../../../domain/entities/missions'

export function Mission() {
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)
  const selectedMission = useAppSelector(state =>
    activeMissionId ? state.missionForms.missions[activeMissionId] : undefined
  )
  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const missionIsNewMission = useMemo(() => isNewMission(activeMissionId), [activeMissionId])

  const { data: missionToEdit, isLoading } = useGetMissionQuery(
    !missionIsNewMission && activeMissionId ? Number(activeMissionId) : skipToken
  )

  const missionFormikValues: Partial<MissionType> = useMemo(() => {
    if (missionIsNewMission && activeMissionId) {
      return missionFactory({ id: activeMissionId } as Partial<NewMission>, true)
    }

    if (missionToEdit) {
      return missionFactory(missionToEdit, false)
    }

    return {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionToEdit, activeMissionId])

  if (isLoading || missionFormikValues?.id !== activeMissionId || !activeMissionId) {
    return <div>Chargement en cours</div>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      <Formik
        key={activeMissionId}
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
            id={activeMissionId}
            isNewMission={missionIsNewMission}
            selectedMission={selectedMission?.missionForm}
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
