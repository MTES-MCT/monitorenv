import { createDashboardFromMission } from '@features/Dashboard/useCases/createDasboardFromMission'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, Dialog, MultiRadio, TextInput } from '@mtes-mct/monitor-ui'
import dayjs from 'dayjs'
import { useState } from 'react'
import styled from 'styled-components'

import type { ControlOrSurveillance, Mission, NewMission } from 'domain/entities/missions'
import type { AtLeast } from 'types'

const EMPTY_VALUE = '-'

type CreateDashboardModalProps = {
  mission: AtLeast<Partial<Mission>, 'id'> | Partial<NewMission> | undefined
  onClose: () => void
  open: boolean
}

export function CreateDashboardModal({ mission, onClose, open }: CreateDashboardModalProps) {
  const dispatch = useAppDispatch()
  const missionGeom =
    mission?.geom?.coordinates.length && mission.geom?.coordinates.length > 0 ? mission.geom : undefined

  const sortedEnvActions = mission?.envActions
    ?.filter(action => action.actionType === 'SURVEILLANCE' || action.actionType === 'CONTROL')
    .sort((actionA, actionB) => {
      if (actionA.actionStartDateTimeUtc === undefined) {
        return -1
      }
      if (actionB.actionStartDateTimeUtc === undefined) {
        return +1
      }

      return actionA.actionStartDateTimeUtc &&
        actionB.actionStartDateTimeUtc &&
        dayjs(actionA.actionStartDateTimeUtc).isBefore(dayjs(actionB.actionStartDateTimeUtc))
        ? +1
        : -1
    }) as ControlOrSurveillance[]

  function initialGeomSource() {
    if (missionGeom) {
      return 'MISSION'
    }
    if (
      sortedEnvActions &&
      sortedEnvActions[0]?.geom?.coordinates &&
      sortedEnvActions[0].geom?.coordinates.length > 0
    ) {
      return 'ACTION'
    }

    return undefined
  }

  const [geomSource, setGeomSource] = useState(initialGeomSource())

  const geomSourceOptions = [
    { isDisabled: !geomSource, label: 'De la mission (calculée automatiquement ou manuelle)', value: 'MISSION' },
    { isDisabled: !geomSource, label: 'De la dernière action de contrôle ou surveillance', value: 'ACTION' }
  ]
  const confirmCreateDashboard = () => {
    const dashboardGeom = geomSource === 'MISSION' ? missionGeom : sortedEnvActions[0]?.geom

    if (!dashboardGeom) {
      return
    }
    const dashboardData = {
      controlUnitIds: mission?.controlUnits?.map(unit => unit.id as number) || [],
      filters: {
        filters: {
          regulatoryTags: sortedEnvActions[0]?.tags || []
        }
      },
      geom: dashboardGeom,
      id: `new-${mission?.id || 'dashboard'}`
    }

    dispatch(createDashboardFromMission(dashboardData))
  }

  const cancelCreateDashboard = () => {
    onClose()
  }

  const updateGeomSource = source => {
    setGeomSource(source)
  }

  const dashboardThemes = sortedEnvActions[0]?.themes?.map(theme => theme.name).join(', ') || EMPTY_VALUE
  const dashboardTags = sortedEnvActions[0]?.tags?.map(tag => tag.name).join(', ') || EMPTY_VALUE

  return (
    open && (
      <Dialog>
        <Dialog.Title>Créer un tableau de bord</Dialog.Title>
        <StyledBody>
          <h5>Informations récupérées</h5>
          <ControlUnitsContainer>
            {mission?.controlUnits?.map((unit, index) => (
              <ControlUnitContainer>
                <StyledTextInput
                  label={`Administration ${index + 1}`}
                  name="administration"
                  plaintext
                  value={unit.administration ? unit.administration : EMPTY_VALUE}
                />
                <StyledTextInput
                  label={`Unité ${index + 1}`}
                  name="controlUnit"
                  plaintext
                  value={unit.name ? unit.name : EMPTY_VALUE}
                />
              </ControlUnitContainer>
            ))}
          </ControlUnitsContainer>
          <MultiRadio
            isRequired
            label="Données de localisation"
            name="geomSourceType"
            onChange={updateGeomSource}
            options={geomSourceOptions}
            value={geomSource}
          />
          <StyledTextInput label="Thématiques" name="themes" plaintext value={dashboardThemes} />
          <StyledTextInput label="Tags" name="tags" plaintext value={dashboardTags} />
        </StyledBody>
        <Dialog.Action>
          <Button disabled={!geomSource} onClick={confirmCreateDashboard}>
            Créer un tableau de bord
          </Button>
          <Button accent={Accent.SECONDARY} onClick={cancelCreateDashboard}>
            Annuler
          </Button>
        </Dialog.Action>
      </Dialog>
    )
  )
}
const StyledBody = styled(Dialog.Body)`
  text-align: left;
  gap: 32px;
`

const ControlUnitsContainer = styled.p`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const ControlUnitContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const StyledTextInput = styled(TextInput)`
  > div > .rs-plaintext {
    color: ${p => p.theme.color.gunMetal};
    font-weight: 500;
  }
`
