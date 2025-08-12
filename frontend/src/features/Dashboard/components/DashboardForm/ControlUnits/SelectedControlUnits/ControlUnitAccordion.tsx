import { Bold, TransparentButton } from '@components/style'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, type ControlUnit, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { Details } from './Details'

export function ControlUnitAccordion({
  controlUnit,
  controlUnitIdExpanded,
  expandUnit
}: {
  controlUnit: ControlUnit.ControlUnit
  controlUnitIdExpanded: number | undefined
  expandUnit: (id: number) => void
}) {
  const dispatch = useAppDispatch()

  const isExpanded = controlUnitIdExpanded === controlUnit.id

  const removeControlUnit = () => {
    dispatch(dashboardActions.removeItems({ itemIds: [controlUnit.id], type: Dashboard.Block.CONTROL_UNITS }))
  }

  return (
    <AccordionContainer>
      <AccordionHeader data-cy={`dashboard-control-unit-accordion-${controlUnit.id}`}>
        <TitleButton
          aria-controls={`control-unit-accordion-${controlUnit.id}`}
          aria-expanded={isExpanded}
          onClick={() => expandUnit(controlUnit.id)}
        >
          <Bold>
            {controlUnit.name} - {controlUnit.administration.name}
          </Bold>
        </TitleButton>

        <StyledIconButton
          $isExpanded={isExpanded}
          accent={Accent.TERTIARY}
          Icon={Icon.Chevron}
          onClick={() => expandUnit(controlUnit.id)}
          title={isExpanded ? 'Replier le contenu' : 'Déplier le contenu'}
        />
        <IconButton
          accent={Accent.TERTIARY}
          Icon={Icon.Close}
          onClick={removeControlUnit}
          title="Désélectionner l'unité"
        />
      </AccordionHeader>
      {isExpanded && <HeaderSeparator />}
      <AccordionContent $isExpanded={isExpanded} id={`control-unit-accordion-${controlUnit.id}`}>
        <Details controlUnit={controlUnit} />
      </AccordionContent>
    </AccordionContainer>
  )
}

const AccordionContainer = styled.div`
  background-color: ${p => p.theme.color.white};
  margin-left: 4px;
  margin-right: 4px;
  gap: 4px;
`
const StyledIconButton = styled(IconButton)<{ $isExpanded: boolean }>`
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s;
`
const AccordionHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 21px 20px;
`
const TitleButton = styled(TransparentButton)`
  display: inline-flex;
  font-size: 16px;
  gap: 8px;
  width: 63%;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const HeaderSeparator = styled.div`
  border-bottom: 2px solid ${p => p.theme.color.gainsboro};
  padding: -24px;
`

const AccordionContent = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  max-height: ${({ $isExpanded }) => ($isExpanded ? '100vh' : '0px')};
  transition: ${({ $isExpanded }) => ($isExpanded ? '0.5s max-height ease-in' : '0.3s max-height ease-out')};
`
