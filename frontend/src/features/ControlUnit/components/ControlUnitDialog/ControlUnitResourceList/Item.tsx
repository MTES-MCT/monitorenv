import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, ControlUnit, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { mapActions } from 'domain/shared_slices/Map'
import { fromLonLat } from 'ol/proj'
import { useCallback } from 'react'
import styled from 'styled-components'

import { Placeholder } from './Placeholder'

import type { Promisable } from 'type-fest'

export type ItemProps = {
  controlUnitResource: ControlUnit.ControlUnitResource
  onEdit?: (controlUnitResourceId: number) => Promisable<void>
}
export function Item({ controlUnitResource, onEdit }: ItemProps) {
  const dispatch = useAppDispatch()

  const handleEdit = useCallback(() => {
    if (!onEdit) {
      return
    }
    onEdit(controlUnitResource.id)
  }, [controlUnitResource.id, onEdit])

  const focusOnStation = () => {
    const baseCoordinate = fromLonLat([controlUnitResource.station.longitude, controlUnitResource.station.latitude])
    dispatch(mapActions.setZoomToCenter(baseCoordinate))
  }

  return (
    <Wrapper data-cy="ControlUnitDialog-control-unit-resource" data-id={controlUnitResource.id}>
      <Placeholder type={controlUnitResource.type} />
      <InfoBox>
        <InfoBoxHeader>
          <div>
            <Name>
              {ControlUnit.ControlUnitResourceTypeLabel[controlUnitResource.type]} – {controlUnitResource.name}
            </Name>
            <p>{controlUnitResource.station.name}</p>
          </div>
          <ButtonsContainer>
            {onEdit && (
              <IconButton accent={Accent.TERTIARY} Icon={Icon.Edit} onClick={handleEdit} title="Éditer ce moyen" />
            )}
            <IconButton
              accent={Accent.TERTIARY}
              Icon={Icon.FocusZones}
              onClick={focusOnStation}
              title="Zommer sur la ville d'attache du moyen"
            />
          </ButtonsContainer>
        </InfoBoxHeader>
        {controlUnitResource.note && <Note>{controlUnitResource.note}</Note>}
      </InfoBox>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.cultured};
  display: flex;
  min-height: 96px;
`

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 8px 3px 8px 16px;
`

const InfoBoxHeader = styled.div`
  color: ${p => p.theme.color.gunMetal};
  display: flex;
  margin-bottom: 8px;
  > div:first-child {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
`
const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`
const Note = styled.div`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  margin-bottom: 4px;
  overflow: hidden;
`

const Name = styled.p`
  font-weight: bold;
`
