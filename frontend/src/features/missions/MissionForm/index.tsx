import { Form, Formik } from 'formik'
import { noop } from 'lodash'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { MissionForm } from './MissionForm'
import { MissionSchema } from './Schemas'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { isNewMission } from '../../../utils/isNewMission'
import { missionFactory } from '../Missions.helpers'

import type { Mission as MissionType, NewMission } from '../../../domain/entities/missions'

export function MissionFormWrapper() {
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)
  const selectedMission = useAppSelector(state =>
    activeMissionId ? state.missionForms.missions[activeMissionId] : undefined
  )
  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const missionIsNewMission = useMemo(() => isNewMission(activeMissionId), [activeMissionId])

  const missionValues: Partial<MissionType> = useMemo(() => {
    if (selectedMission?.missionForm) {
      return missionFactory(selectedMission.missionForm, false)
    }

    if (missionIsNewMission && activeMissionId) {
      return missionFactory({ id: activeMissionId } as Partial<NewMission>, true)
    }

    return {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMission?.missionForm, activeMissionId])

  if (!missionValues || missionValues?.id !== activeMissionId || !activeMissionId) {
    return <div>Chargement en cours</div>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      <Formik
        key={missionValues?.id}
        enableReinitialize
        initialValues={missionValues}
        onSubmit={noop}
        validateOnBlur={false}
        validateOnChange={shouldValidateOnChange}
        validateOnMount={false}
        validationSchema={MissionSchema}
      >
        <Form className="rs-form rs-form-vertical rs-form-fixed-width">
          <MissionForm
            id={activeMissionId}
            isControlUnitAlreadyEngaged={selectedMission?.isControlUnitAlreadyEngaged ?? false}
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
