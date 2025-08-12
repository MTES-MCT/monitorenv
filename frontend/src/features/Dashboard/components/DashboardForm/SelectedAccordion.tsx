import { TransparentButton } from '@components/style'
import { dashboardActions } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import React from 'react'
import styled from 'styled-components'

type SelectedAccordionProps = {
  children?: React.ReactNode
  className?: string
  isExpanded: boolean
  isReadOnly?: boolean
  setExpandedAccordion?: () => void
  title: string
}

export function SelectedAccordion({
  children,
  className,
  isExpanded,
  isReadOnly = false,
  setExpandedAccordion,
  title
}: SelectedAccordionProps) {
  const dispatch = useAppDispatch()

  const onClickAccordion = () => {
    if (setExpandedAccordion) {
      dispatch(dashboardActions.setDashboardPanel())
      setExpandedAccordion()
    }
  }

  return (
    <AccordionContainer>
      <AccordionHeader onClick={onClickAccordion}>
        <TitleButton aria-controls={`selected-${title}-accordion`} aria-expanded={isExpanded}>
          {title}
        </TitleButton>
        {!isReadOnly && (
          <StyledIconButton
            $isExpanded={isExpanded}
            accent={Accent.TERTIARY}
            Icon={Icon.Chevron}
            onClick={onClickAccordion}
            title={isExpanded ? 'Replier le contenu' : 'Déplier le contenu'}
          />
        )}
      </AccordionHeader>
      <AccordionContent $isExpanded={isExpanded} className={className} id={`selected-${title}-accordion`}>
        <Wrapper>{children}</Wrapper>
      </AccordionContent>
    </AccordionContainer>
  )
}

const AccordionContainer = styled.div`
  background-color: ${p => p.theme.color.blueGray25};
  box-shadow: 0px 3px 6px #70778540;
  padding-bottom: 4px;
`

const StyledIconButton = styled(IconButton)<{ $isExpanded: boolean }>`
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s;
`

const AccordionHeader = styled.header`
  align-items: center;
  color: ${p => p.theme.color.charcoal};
  cursor: pointer;
  display: flex;
  font-weight: 500;
  line-height: 22px;
  justify-content: space-between;
  padding: 0 24px;
  height: 32px;
`

const TitleButton = styled(TransparentButton)`
  font-size: 13px;
  font-weight: 500;
  text-align: start;
  background: transparent;
  &:hover {
    background: transparent;
  }
`

const AccordionContent = styled.div<{ $isExpanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isExpanded }) => ($isExpanded ? '1fr' : '0fr')};
  transition: ${({ $isExpanded }) =>
    $isExpanded ? '0.5s grid-template-rows ease-in' : '0.3s grid-template-rows ease-out'};

  & > :last-child {
    border-bottom: none;
  }
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  overflow: hidden;
`
