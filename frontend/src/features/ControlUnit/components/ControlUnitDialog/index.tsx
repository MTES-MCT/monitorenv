import { useGetMissionsQuery } from '@api/missionsAPI'
import { editMissionInLocalStore } from '@features/Mission/useCases/editMissionInLocalStore'
import { sideWindowActions } from '@features/SideWindow/slice'
import { Accent, Button, customDayjs, Icon, IconButton, MapMenuDialog } from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { MissionFiltersEnum, resetMissionFilters, updateFilters } from 'domain/shared_slices/MissionFilters'
import { Formik } from 'formik'
import { noop } from 'lodash/fp'
import { useCallback } from 'react'
import styled from 'styled-components'

import { AreaNote } from './AreaNote'
import { ControlUnitContactList } from './ControlUnitContactList'
import { ControlUnitResourceList } from './ControlUnitResourceList'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../../api/constants'
import { useGetControlUnitQuery, useUpdateControlUnitMutation } from '../../../../api/controlUnitsAPI'
import { globalActions } from '../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { FrontendError } from '../../../../libs/FrontendError'
import { mainWindowActions } from '../../../MainWindow/slice'
import { addMission } from '../../../Mission/useCases/addMission'

export function ControlUnitDialog() {
  const dispatch = useAppDispatch()
  const isRightMenuOpened = useAppSelector(store => store.mainWindow.isRightMenuOpened)
  const mapControlUnitDialog = useAppSelector(store => store.mapControlUnitDialog)
  if (!mapControlUnitDialog.controlUnitId) {
    throw new FrontendError('`mapControlUnitDialog.controlUnitId` is undefined.')
  }

  const { data: controlUnit } = useGetControlUnitQuery(mapControlUnitDialog.controlUnitId, RTK_DEFAULT_QUERY_OPTIONS)
  const [updateControlUnit] = useUpdateControlUnitMutation()

  const openNewMission = useCallback(() => {
    dispatch(addMission({ initialControlUnit: controlUnit }))
  }, [controlUnit, dispatch])

  const close = useCallback(() => {
    dispatch(
      globalActions.setDisplayedItems({
        visibility: { isControlUnitDialogVisible: false }
      })
    )
    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
  }, [dispatch])

  const now = customDayjs().utc()
  const { selectedMission } = useGetMissionsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      selectedMission: data?.find(
        mission =>
          mission.controlUnits.some(unit => unit.id === controlUnit?.id) &&
          now.isBetween(customDayjs(mission.startDateTimeUtc), customDayjs(mission.endDateTimeUtc))
      )
    }),
    skip: !controlUnit
  })

  const openMission = (missionId: number) => {
    dispatch(editMissionInLocalStore(missionId, 'map'))
  }

  const openFilteredMissions = (controlUnitId: number) => {
    const sixMonthsAgo = customDayjs().subtract(6, 'month').toISOString()
    dispatch(resetMissionFilters())
    dispatch(updateFilters({ key: MissionFiltersEnum.UNIT_FILTER, value: [controlUnitId] }))
    dispatch(updateFilters({ key: MissionFiltersEnum.PERIOD_FILTER, value: DateRangeEnum.CUSTOM }))
    dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_AFTER_FILTER, value: sixMonthsAgo }))
    dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_BEFORE_FILTER, value: customDayjs().toISOString() }))
    dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
  }

  const backToList = () => {
    dispatch(
      globalActions.setDisplayedItems({
        visibility: { isControlUnitDialogVisible: false, isControlUnitListDialogVisible: true }
      })
    )
    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
  }

  if (!controlUnit) {
    return (
      <MapMenuDialog.Container>
        <MapMenuDialog.Header>
          <MapMenuDialog.Title>Chargement en cours...</MapMenuDialog.Title>
          <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={close} />
        </MapMenuDialog.Header>
      </MapMenuDialog.Container>
    )
  }

  return (
    <Wrapper $isRightMenuOpened={isRightMenuOpened}>
      <StyledHeader>
        <StyledIconButton accent={Accent.TERTIARY} Icon={Icon.Chevron} onClick={backToList} />
        <MapMenuDialog.Title title={`${controlUnit.name} (${controlUnit.administration.name})`}>
          <b>{controlUnit.name}</b> ({controlUnit.administration.name})
        </MapMenuDialog.Title>
        <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={close} />
      </StyledHeader>
      <Formik initialValues={controlUnit} onSubmit={noop}>
        <StyledMapMenuDialogBody>
          <Button accent={Accent.PRIMARY} Icon={Icon.Plus} isFullWidth onClick={openNewMission}>
            Créer une mission avec cette unité
          </Button>
          <MissionControls>
            {selectedMission && (
              <Button
                accent={Accent.SECONDARY}
                Icon={Icon.MissionAction}
                isFullWidth
                onClick={() => openMission(selectedMission.id)}
              >
                Ouvrir la mission en cours
              </Button>
            )}
            <Button
              accent={Accent.SECONDARY}
              Icon={Icon.ListLines}
              isFullWidth
              onClick={() => openFilteredMissions(controlUnit.id)}
            >
              Voir les missions de l&apos;unité
            </Button>
          </MissionControls>

          <ControlUnitContactList controlUnit={controlUnit} onSubmit={updateControlUnit} />
          <ControlUnitResourceList controlUnit={controlUnit} />
          <AreaNote controlUnit={controlUnit} onSubmit={updateControlUnit} />
        </StyledMapMenuDialogBody>
      </Formik>
    </Wrapper>
  )
}

// TODO This wrapper should be a shared Env `<FullHeightMapRightDialog />` component to avoid logical + styling repetition.
const Wrapper = styled(MapMenuDialog.Container)<{
  $isRightMenuOpened: boolean
}>`
  bottom: 0;
  /* TODO Remove margin in monitor-ui. */
  margin: 0;
  max-height: 100%;
  height: fit-content;
  position: absolute;
  right: ${p => (p.$isRightMenuOpened ? 56 : 8)}px;
  top: 0;
  transition: right 0.5s ease-out, top 0.5s ease-out;
  width: 500px;
  z-index: 2;
`

const StyledHeader = styled(MapMenuDialog.Header)`
  height: 48px;
  padding: 14px 11px 14px 8px;
`

const StyledIconButton = styled(IconButton)`
  transform: rotate(90deg);
  color: ${p => p.theme.color.white};
  &:hover,
  &._hover {
    color: ${p => p.theme.color.white};
  }

  &:active,
  &._active {
    color: ${p => p.theme.color.white};
  }

  &:disabled,
  &._disabled {
    color: ${p => p.theme.color.white};
  }
`
const StyledMapMenuDialogBody = styled(MapMenuDialog.Body)`
  background-color: ${p => p.theme.color.gainsboro};

  > div:not(:first-child) {
    margin-top: 12px;
  }
`

const MissionControls = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`
