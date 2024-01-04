import { Form, Formik } from 'formik'
import { noop } from 'lodash'
import { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { useUpdateFreezedFormValues } from './hooks/useUpdateFreezedFormValues'
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
  const [formKey, setFormKey] = useState(0)

  const missionIsNewMission = useMemo(() => isNewMission(activeMissionId), [activeMissionId])

  const missionValues: Partial<MissionType> = useMemo(() => {
    if (missionIsNewMission && activeMissionId) {
      return missionFactory({ id: activeMissionId } as Partial<NewMission>, true)
    }

    if (selectedMission?.missionForm) {
      return missionFactory(selectedMission.missionForm, false)
    }

    return {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMission?.missionForm, activeMissionId])

  // `formikFormValuesRef` is freezed as Formik manage his state internally
  const formikFormValuesRef = useRef<Partial<MissionType> | undefined>(undefined)
  useUpdateFreezedFormValues(formikFormValuesRef.current, missionValues, nextFormValues => {
    formikFormValuesRef.current = nextFormValues
    setFormKey(key => key + 1)
  })

  if (!formikFormValuesRef.current || missionValues?.id !== activeMissionId || !activeMissionId) {
    return <div>Chargement en cours</div>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      <Formik
        key={formKey}
        enableReinitialize
        initialValues={formikFormValuesRef.current}
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
