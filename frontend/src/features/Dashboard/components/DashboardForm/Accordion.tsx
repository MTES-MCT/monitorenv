import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { ReactNode } from 'react'

type AccordionProps = {
  children: ReactNode
  headerButton?: ReactNode
  isExpanded: boolean
  name?: string
  setExpandedAccordion: () => void
  title: string | ReactNode
}

export function Accordion({ children, headerButton, isExpanded, name, setExpandedAccordion, title }: AccordionProps) {
  return (
    <AccordionContainer $withCursor={!headerButton}>
      <AccordionHeader
        aria-controls={`${title}-accordion`}
        aria-expanded={isExpanded}
        onClick={!headerButton ? setExpandedAccordion : undefined}
      >
        <TitleContainer>
          <Title>{title}</Title>
          {headerButton}
        </TitleContainer>
        <StyledIconButton
          $isExpanded={isExpanded}
          accent={Accent.TERTIARY}
          Icon={Icon.Chevron}
          onClick={setExpandedAccordion}
        />
      </AccordionHeader>
      <HeaderSeparator />
      <AccordionContent $isExpanded={isExpanded} id={`${name ?? title}-accordion`}>
        {children}
      </AccordionContent>
    </AccordionContainer>
  )
}

const AccordionContainer = styled.div<{ $withCursor: boolean }>`
  box-shadow: 0px 3px 6px #70778540;
  cursor: ${({ $withCursor }) => ($withCursor ? 'pointer' : 'default')};
`
const StyledIconButton = styled(IconButton)<{ $isExpanded: boolean }>`
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s;
`
const AccordionHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 21px 24px;
`
const TitleContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 16px;
`
const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
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
