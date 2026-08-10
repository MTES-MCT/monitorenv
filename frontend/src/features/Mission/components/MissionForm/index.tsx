import { Banner, Icon, Level, THEME } from '@mtes-mct/monitor-ui'
import { Form, Formik } from 'formik'
import { noop } from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { MissionForm } from './MissionForm'
import { MissionSchema } from './Schemas'
import { getActiveMission } from './slice'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { missionFactory } from '../../Missions.helpers'
import { isMissionNew } from '../../utils'

import type { Mission as MissionType, NewMission } from '../../../../domain/entities/missions'

export function MissionFormWrapper() {
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)

  const selectedMission = useAppSelector(state => getActiveMission(state.missionForms))

  const engagedControlUnit = selectedMission?.engagedControlUnit

  const activeAction = selectedMission?.activeAction

  const missionIsNewMission = useMemo(() => isMissionNew(activeMissionId), [activeMissionId])

  const missionValues: Partial<MissionType> = useMemo(() => {
    if (selectedMission?.missionForm) {
      return missionFactory(selectedMission.missionForm, false)
    }

    if (missionIsNewMission && activeMissionId) {
      return missionFactory({ id: activeMissionId } as Partial<NewMission>, true)
    }

    return {}

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMissionId])

  if (!missionValues || missionValues?.id !== activeMissionId || !activeMissionId) {
    return <div>Chargement en cours</div>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      {selectedMission?.displayCreatedMissionBanner && (
        <Banner
          isClosable
          isCollapsible={false}
          isHiddenByDefault={false}
          level={Level.SUCCESS}
          top="0"
          withAutomaticClosing
        >
          <MissionCreatedText>
            <Icon.Confirm color={THEME.color.mediumSeaGreen} />
            La mission a bien été créée
          </MissionCreatedText>
        </Banner>
      )}

      <Formik
        key={missionValues.id}
        enableReinitialize
        initialValues={missionValues}
        onSubmit={noop}
        validateOnMount
        validationSchema={MissionSchema}
      >
        <Form className="rs-form rs-form-vertical rs-form-fixed-width">
          <MissionForm
            activeActionId={activeAction?.id}
            engagedControlUnit={selectedMission?.engagedControlUnit ?? undefined}
            id={activeMissionId}
            isNewMission={missionIsNewMission}
            selectedMission={selectedMission?.missionForm}
          />
        </Form>
      </Formik>
      {engagedControlUnit && <DisabledMissionBackground />}
    </EditMissionWrapper>
  )
}

const EditMissionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`
const DisabledMissionBackground = styled.div`
  position: absolute;
  background-color: ${p => p.theme.color.white};
  opacity: 0.6;
  width: 100%;
  height: 100%;
  z-index: 6;
`
const MissionCreatedText = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: center;
`
