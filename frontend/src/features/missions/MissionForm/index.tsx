/* eslint-disable react/jsx-props-no-spreading */
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { matchPath } from 'react-router-dom'
import styled from 'styled-components'

import { useGetMissionQuery } from '../../../api/missionsAPI'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { onNavigate } from '../../../domain/use_cases/navigation/onNavigate'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MissionSourceTag } from '../../../ui/MissionSourceTag'
import { Header } from '../../SideWindow/Header'
import { missionFactory } from '../Missions.helpers'
import { MissionForm } from './MissionForm'

export function Mission() {
  const { sideWindow } = useAppSelector(state => state)
  const dispatch = useDispatch()

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

  const onQuitMission = () => {
    dispatch(onNavigate(sideWindowPaths.MISSIONS))
  }

  if (id && !missionToEdit) {
    return <div>Chargement en cours</div>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      <Header onClose={onQuitMission} title="Edition de la mission" withCloseButton>
        <MissionSourceTag source={missionToEdit?.missionSource} />
      </Header>
      <MissionForm formValues={missionFormikValues} id={id} mission={missionToEdit} />
    </EditMissionWrapper>
  )
}

const EditMissionWrapper = styled.div`
  flex: 1;
  max-width: 100vw;
`
