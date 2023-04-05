import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { ControlUnit, getControlUnitsAsText } from '../../../../domain/entities/controlUnit'
import { missionTypeEnum } from '../../../../domain/entities/missions'
import { editMission } from '../../../../domain/use_cases/missions/editMission'
import { clearSelectedMissionOnMap } from '../../../../domain/use_cases/missions/selectMissionOnMap'
import { MissionSourceTag } from '../../../../ui/MissionSourceTag'
import { MissionStatusLabel } from '../../../../ui/MissionStatusLabel'
import { ReactComponent as CloseIconSVG } from '../../../../uiMonitor/icons/Close.svg'
import { ReactComponent as EditIconSVG } from '../../../../uiMonitor/icons/Edit.svg'
import { missionTypesToString } from '../../../../utils/missionTypes'
import { pluralize } from '../../../../utils/pluralize'
import { margins } from './constants'

export function MissionCard({ feature, selected }: { feature: any; selected?: boolean }) {
  const dispatch = useDispatch()
  const {
    controlUnits,
    missionId,
    missionSource,
    missionStatus,
    missionTypes,
    numberOfControls,
    numberOfSurveillance,
    startDateTimeUtc
  } = feature.getProperties()

  const parsedstartDateTimeUtc = new Date(startDateTimeUtc)
  const formattedDate = isValid(parsedstartDateTimeUtc) && format(parsedstartDateTimeUtc, 'dd MMM yyyy', { locale: fr })

  const handleEditMission = useCallback(() => {
    dispatch(editMission(missionId))
  }, [dispatch, missionId])

  const handleCloseOverlay = useCallback(() => {
    dispatch(clearSelectedMissionOnMap())
  }, [dispatch])

  return (
    <Wrapper data-cy="mission-overlay">
      {selected && (
        <IconButton
          accent={Accent.TERTIARY}
          color="red"
          data-cy="mission-overlay-close"
          icon={Icon.Close}
          iconSize={14}
          onClick={handleCloseOverlay}
        />
      )}
      <ZoneText>
        <Title>
          {controlUnits.length === 1 && (
            <>
              <div>{controlUnits[0].name.toUpperCase()}</div>
              {controlUnits[0].contact ? (
                <div>{controlUnits[0].contact}</div>
              ) : (
                <NoContact>Aucun contact renseigné</NoContact>
              )}
            </>
          )}
          {controlUnits.length > 1 && controlUnits[0] && (
            <>
              <div>{controlUnits[0].name.toUpperCase()}</div>
              <MultipleControlUnits>
                et {controlUnits.length - 1} {pluralize('autre', controlUnits.length - 1)}{' '}
                {pluralize('unité', controlUnits.length - 1)}
              </MultipleControlUnits>
            </>
          )}
        </Title>
        <Details>
          <MissionSourceTag source={missionSource} />
          <div>
            Mission {missionTypesToString(missionTypes)} – {formattedDate}
          </div>
          <div>
            {numberOfControls} {pluralize('contrôle', numberOfControls)} et {numberOfSurveillance}{' '}
            {pluralize('surveillance', numberOfSurveillance)}{' '}
            {pluralize('réalisé', numberOfControls + numberOfSurveillance)}
          </div>
          <div>
            <MissionStatusLabel missionStatus={missionStatus} />
          </div>
        </Details>
      </ZoneText>
      <EditButton
        accent={Accent.PRIMARY}
        disabled={!selected}
        Icon={Icon.Calendar}
        onClick={handleEditMission}
        size={Size.SMALL}
      >
        Editer la mission
      </EditButton>
    </Wrapper>
    /*     <MissionCardHeader>
      <Col1>
        <MissionDate>
          {isValid(parsedstartDateTimeUtc) && format(parsedstartDateTimeUtc, 'dd MMM yyyy', { locale: fr })}
        </MissionDate>
      </Col1>
      <Col2>
        <MissionType>Mission {missionTypeEnum[missionType]?.libelle}</MissionType>
        <MissionResources>{getControlUnitsAsText(controlUnits)}</MissionResources>
        <MissionSourceTag source={missionSource} />
        <Actions>
          {numberOfActions || 0} action{numberOfActions > 1 ? 's' : ''} réalisée{numberOfActions > 1 ? 's' : ''}
        </Actions>
        <MissionStatusLabel missionStatus={missionStatus} />
        {selected && (
          <EditButton
            appearance="primary"
            icon={<EditIconSVG className="rs-icon" />}
            onClick={handleEditMission}
            size="sm"
          >
            Editer
          </EditButton>
        )}
      </Col2>
      <Col3>
        {selected && (
          <IconButton
            appearance="link"
            icon={<CloseIconSVG className="rs-icon" />}
            onClick={handleCloseOverlay}
            size="sm"
          />
        )}
      </Col3>
    </MissionCardHeader> */
  )
}

/* const MissionSourceTag = styled(Tag)`
  background: ${p => p.theme.color.blueGray[100]};
  color: ${p => p.theme.color.white};
  margin-bottom: 8px;
  margin-top: 4px;
` */

const NoContact = styled.div`
  color: ${COLORS.slateGray};
  font-weight: 400;
  font-style: italic;
`

const MultipleControlUnits = styled.div`
  color: ${COLORS.slateGray};
`

const EditButton = styled(Button)`
  margin-left: 12px;
  margin-top: 12px;
`

const CloseButton = styled(IconButton)`
  position: absolute;
  right: 0;
  margin: 5px;
`

const Details = styled.div`
  margin-top: 8px;
  color: ${COLORS.slateGray};
`

const Title = styled.div`
  height: 40px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font: normal normal bold 13px/18px Marianne;
  color: ${COLORS.gunMetal};
`

const Wrapper = styled.div`
  padding-top: 1px;
  box-shadow: 0px 3px 6px #70778540;
  line-height: 20px;
  text-align: left;
  height: 201px;
  width: 260px;
  border-radius: 1px;
  background-color: ${COLORS.white};
`

const InProgressIcon = styled.span`
  height: 8px;
  width: 8px;
  margin-right: 5px;
  background-color: #33a02c;
  border-radius: 50%;
  display: inline-block;
`

const ZoneText = styled.div`
  margin: 11px 12px 0px 12px;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const TrianglePointer = styled.div`
  margin-left: auto;
  margin-right: auto;
  height: auto;
  width: auto;
`

const BottomTriangleShadow = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 11px 6px 0 6px;
  border-color: ${p => p.theme.color.white} transparent transparent transparent;
  margin-left: ${-margins.xMiddle - 6}px;
  margin-top: -4px;
  clear: top;
`

const TopTriangleShadow = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-top: transparent;
  border-right: 6px solid transparent;
  border-bottom: 11px solid ${p => p.theme.color.white};
  border-left: 6px solid transparent;
  margin-left: ${-margins.xMiddle - 6}px;
  margin-top: ${margins.yBottom + 45}px;
  clear: top;
`

const RightTriangleShadow = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-right: transparent;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 11px solid ${p => p.theme.color.white};
  margin-left: ${-margins.xRight - 40}px;
  margin-top: ${margins.yMiddle + 25}px;
  clear: top;
`

const LeftTriangleShadow = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-top: 6px solid transparent;
  border-right: 11px solid ${p => p.theme.color.white};
  border-bottom: 6px solid transparent;
  border-left: transparent;
  margin-left: -11px;
  margin-top: ${margins.yMiddle + 25}px;
  clear: top;
`

const MissionCardHeader = styled.div`
  background: ${COLORS.white};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  display: flex;
  width: 380px;
  height: 157px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
`

const MissionDate = styled.div`
  width: 80px;
  font-size: 12px;
  margin-right: 16px;
`

const MissionType = styled.div`
  font-weight: bold;
`

const MissionResources = styled.div`
  font-size: 12px;
  color: ${COLORS.slateGray};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-top: 5px;
  margin-bottom: 5px;
`
const Actions = styled.div`
  margin-top: 5px;
`

const Col1 = styled.div`
  padding: 8px 0px 5px 10px;
`
const Col2 = styled.div`
  padding: 8px 8px 4px 8px;
`
const Col3 = styled.div`
  margin-left: auto;
  padding-right: 4px;
`
