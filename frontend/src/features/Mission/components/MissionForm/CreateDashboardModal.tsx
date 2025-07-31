import { createDashboardFromMission } from '@features/Dashboard/useCases/createDasboardFromMission'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, Dialog, MultiRadio, TextInput, type Option } from '@mtes-mct/monitor-ui'
import dayjs from 'dayjs'
import { ActionTypeEnum, type ControlOrSurveillance, type Mission, type NewMission } from 'domain/entities/missions'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { computeCircleZone } from './hooks/useUpdateMissionZone'

import type { AtLeast } from 'types'

const EMPTY_VALUE = '-'

type GeomSourceType = 'MISSION' | 'ACTION' | undefined

type CreateDashboardModalProps = {
  mission: AtLeast<Partial<Mission>, 'id'> | Partial<NewMission> | undefined
  onClose: () => void
}

export function CreateDashboardModal({ mission, onClose }: CreateDashboardModalProps) {
  const dispatch = useAppDispatch()

  const missionGeom =
    mission?.geom?.coordinates.length && mission.geom?.coordinates.length > 0 ? mission.geom : undefined

  const sortedEnvActions = mission?.envActions
    ?.filter(
      action => action.actionType === ActionTypeEnum.SURVEILLANCE || action.actionType === ActionTypeEnum.CONTROL
    )
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

  const firstEnvAction = sortedEnvActions?.[0]

  function initialGeomSource(): GeomSourceType {
    if (missionGeom) {
      return 'MISSION'
    }
    if (sortedEnvActions && firstEnvAction?.geom?.coordinates && firstEnvAction.geom?.coordinates.length > 0) {
      return 'ACTION'
    }

    return undefined
  }

  const [geomSource, setGeomSource] = useState<GeomSourceType>(initialGeomSource())

  const dashboardGeom = useMemo(() => {
    if (geomSource === 'MISSION' && missionGeom) {
      return missionGeom
    }
    if (geomSource === 'ACTION' && firstEnvAction?.geom?.coordinates) {
      if (firstEnvAction.actionType === ActionTypeEnum.CONTROL) {
        return computeCircleZone(firstEnvAction.geom.coordinates[0])
      }

      return firstEnvAction.geom
    }

    return undefined
  }, [geomSource, missionGeom, firstEnvAction?.geom, firstEnvAction?.actionType])

  const geomSourceOptions: Option<'MISSION' | 'ACTION'>[] = [
    {
      isDisabled: !missionGeom,
      label: 'De la mission (calculée automatiquement ou manuelle)',
      value: 'MISSION'
    },
    {
      isDisabled: !firstEnvAction?.geom?.coordinates.length,
      label: 'De la dernière action de contrôle ou surveillance',
      value: 'ACTION'
    }
  ]
  const confirm = () => {
    if (!dashboardGeom) {
      return
    }
    const dashboardData = {
      controlUnitIds: mission?.controlUnits?.map(unit => unit.id as number) || [],
      geom: dashboardGeom,
      id: `new-${mission?.id || 'dashboard'}`,
      tags: firstEnvAction?.tags ?? undefined,
      themes: firstEnvAction?.themes ?? undefined
    }

    dispatch(createDashboardFromMission(dashboardData))
  }

  const cancel = () => {
    onClose()
  }

  const updateGeomSource = (source: GeomSourceType) => {
    setGeomSource(source)
  }

  const dashboardThemes = firstEnvAction?.themes?.map(theme => theme.name).join(', ') || EMPTY_VALUE
  const dashboardTags = firstEnvAction?.tags?.map(tag => tag.name).join(', ') || EMPTY_VALUE

  return (
    <Dialog isAbsolute>
      <Dialog.Title>Créer un tableau de bord</Dialog.Title>
      <StyledBody>
        <h5>Informations récupérées</h5>
        <ControlUnitsContainer>
          {mission?.controlUnits?.map((unit, index) => (
            <ControlUnitContainer key={unit.id}>
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
        <Button disabled={!geomSource} onClick={confirm}>
          Créer le tableau de bord
        </Button>
        <Button accent={Accent.SECONDARY} onClick={cancel}>
          Annuler
        </Button>
      </Dialog.Action>
    </Dialog>
  )
}
const StyledBody = styled(Dialog.Body)`
  text-align: left;
  gap: 32px;
`

const ControlUnitsContainer = styled.div`
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
