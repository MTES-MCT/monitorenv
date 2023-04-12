/* eslint-disable react/jsx-props-no-spreading */
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMemo } from 'react'
import { matchPath } from 'react-router-dom'
import styled from 'styled-components'

import { useGetMissionQuery, useUpdateMissionMutation, useCreateMissionMutation } from '../../../api/missionsAPI'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MissionSourceTag } from '../../../ui/MissionSourceTag'
import { Header } from '../../SideWindow/Header'
import { missionFactory } from '../Missions.helpers'
import { MissionForm } from './MissionForm'

export function Mission() {
  const { sideWindow } = useAppSelector(state => state)

  const routeParams = matchPath<{ id: string }>(sideWindow.currentPath, {
    exact: true,
    path: [sideWindowPaths.MISSION, sideWindowPaths.MISSION_NEW],
    strict: true
  })

  const id = routeParams?.params?.id ? parseInt(routeParams?.params?.id, 10) : undefined

  const { data: missionToEdit } = useGetMissionQuery(id ?? skipToken)
  // console.log('missionToEdit', missionToEdit)

  const [updateMission, { isLoading: isLoadingUpdateMission }] = useUpdateMissionMutation()

  const [createMission, { isLoading: isLoadingCreateMission }] = useCreateMissionMutation()

  const missionFormikValues = useMemo(() => {
    if (!id) {
      return missionFactory()
    }

    return missionFactory(missionToEdit)
  }, [missionToEdit, id])
  // console.log('missionFormikValues', missionFormikValues)

  if (id && !missionToEdit) {
    return <Loading>Chargement en cours</Loading>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      <Header
        title={`Edition de la mission${
          isLoadingUpdateMission || isLoadingCreateMission ? ' - Enregistrement en cours' : ''
        }`}
      >
        <MissionSourceTag source={missionToEdit?.missionSource} />
      </Header>
      <MissionForm
        formValues={missionFormikValues}
        id={id}
        onCreateMission={createMission}
        onUpdateMission={updateMission}
      />
    </EditMissionWrapper>
  )
}

const Loading = styled.div``

const EditMissionWrapper = styled.div`
  flex: 1;
  max-width: 100vw;
`
