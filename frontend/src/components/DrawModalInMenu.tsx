import { ValidateButton } from '@features/VigilanceArea/components/VigilanceAreaForm/style'
import { Accent, Button, FieldError, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { InteractionType } from 'domain/entities/map/constants'
import styled from 'styled-components'

import type { GeoJSON } from 'domain/types/GeoJSON'

export function DrawModalInMenu({
  className,
  geometry,
  handleSelectInteraction,
  handleValidate,
  interactionType,
  isGeometryValid,
  onCancel,
  reset,
  validateText
}: {
  className?: string
  geometry: GeoJSON.Geometry | undefined
  handleSelectInteraction: (interactionType: InteractionType) => () => void
  handleValidate: () => void
  interactionType: InteractionType
  isGeometryValid: boolean
  onCancel: () => void
  reset: () => void
  validateText: string
}) {
  const showErrorMessage = !isGeometryValid && geometry && 'coordinates' in geometry && geometry.coordinates.length > 0

  return (
    <div className={className}>
      <Header>
        <Title>Définition d&apos;une zone</Title>
        <IconButton accent={Accent.TERTIARY} color={THEME.color.white} Icon={Icon.Close} onClick={onCancel} />
      </Header>
      <Body>
        <Controls>
          <li>
            <IconButton
              className={interactionType === InteractionType.POLYGON ? '_active' : undefined}
              Icon={Icon.SelectPolygon}
              onClick={handleSelectInteraction(InteractionType.POLYGON)}
            />
          </li>
          <li>
            <IconButton
              className={interactionType === InteractionType.SQUARE ? '_active' : undefined}
              Icon={Icon.SelectRectangle}
              onClick={handleSelectInteraction(InteractionType.SQUARE)}
            />
          </li>
          <li>
            <IconButton
              className={interactionType === InteractionType.CIRCLE ? '_active' : undefined}
              Icon={Icon.SelectCircle}
              onClick={handleSelectInteraction(InteractionType.CIRCLE)}
            />
          </li>
          <ResetButton accent={Accent.SECONDARY} onClick={reset}>
            Réinitialiser
          </ResetButton>
        </Controls>

        <div>
          <CreateButton disabled={!isGeometryValid} onClick={handleValidate}>
            {validateText}
          </CreateButton>
          {showErrorMessage && <FieldError>Le tracé n&apos;est pas valide</FieldError>}
        </div>
      </Body>
    </div>
  )
}

const Controls = styled.ul`
  display: flex;
  gap: 16px;
  padding: 0;
`

const Header = styled.header`
  align-items: center;
  background: ${p => p.theme.color.charcoal};
  display: flex;
  justify-content: space-between;
  padding: 9px 16px 10px;
`
const Title = styled.h2`
  color: ${p => p.theme.color.white};
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
`

const Body = styled.div`
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  padding: 16px;
`
const ResetButton = styled(Button)`
  height: 32px;
  margin-left: auto;
`

const CreateButton = styled(ValidateButton)`
  width: 100%;
`
