import { VigilanceAreaFormTypeOpen, vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, FieldError, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { InteractionType } from 'domain/entities/map/constants'
import { restorePreviousDisplayedItems } from 'domain/shared_slices/Global'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import { SubFormBody, SubFormHeader, SubFormHelpText, SubFormTitle, ValidateButton } from './style'

export function DrawVigilanceArea({ onCancel }: { onCancel: () => void }) {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.vigilanceArea.geometry)
  const interactionType = useAppSelector(state => state.vigilanceArea.interactionType)
  const isGeometryValid = useAppSelector(state => state.vigilanceArea.isGeometryValid)
  const initialGeometry = useAppSelector(state => state.vigilanceArea.initialGeometry)

  const { setFieldValue } = useFormikContext<VigilanceArea.VigilanceArea>()

  const handleSelectInteraction = (nextInteraction: InteractionType) => () => {
    dispatch(vigilanceAreaActions.setInteractionType(nextInteraction))
  }

  const handleValidate = () => {
    setFieldValue('geom', geometry)
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.FORM))
    dispatch(vigilanceAreaActions.setInitialGeometry(undefined))
    dispatch(restorePreviousDisplayedItems())
  }

  const reinitialize = () => {
    if (!initialGeometry) {
      dispatch(
        vigilanceAreaActions.setGeometry({
          coordinates: [],
          type: 'MultiPolygon'
        })
      )

      return
    }
    dispatch(vigilanceAreaActions.setGeometry(initialGeometry))
  }

  return (
    <>
      <SubFormHeader>
        <SubFormTitle>Ajout de tracés en cours...</SubFormTitle>
        <IconButton accent={Accent.TERTIARY} color={THEME.color.white} Icon={Icon.Close} onClick={onCancel} />
      </SubFormHeader>
      <SubFormBody>
        <SubFormHelpText>Dessinez ou sélectionnez un ou plusieurs tracés sur la carte</SubFormHelpText>
        <DrawButtonRow>
          <IconGroup>
            <IconButton
              className={interactionType === InteractionType.POLYGON ? '_active' : undefined}
              Icon={Icon.SelectPolygon}
              onClick={handleSelectInteraction(InteractionType.POLYGON)}
            />
            <IconButton
              className={interactionType === InteractionType.SQUARE ? '_active' : undefined}
              Icon={Icon.SelectRectangle}
              onClick={handleSelectInteraction(InteractionType.SQUARE)}
            />
            <IconButton
              className={interactionType === InteractionType.CIRCLE ? '_active' : undefined}
              Icon={Icon.SelectCircle}
              onClick={handleSelectInteraction(InteractionType.CIRCLE)}
            />
          </IconGroup>
        </DrawButtonRow>

        <ValidateButtonContainer>
          <ValidateButtonRow>
            <Button accent={Accent.SECONDARY} onClick={reinitialize}>
              Réinitialiser les tracés
            </Button>
            <ValidateButton disabled={!isGeometryValid} onClick={handleValidate}>
              Valider les tracés
            </ValidateButton>
          </ValidateButtonRow>
          {!isGeometryValid && <FieldError>Le tracé n&apos;est pas valide</FieldError>}
        </ValidateButtonContainer>
      </SubFormBody>
    </>
  )
}

const IconGroup = styled.div`
  display: flex;
  gap: 16px;
`

const DrawButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`
const ValidateButtonContainer = styled.div`
  align-self: end;
  display: flex;
  flex-direction: column;
`

const ValidateButtonRow = styled.div`
  align-self: end;
  display: flex;
  gap: 8px;
`
