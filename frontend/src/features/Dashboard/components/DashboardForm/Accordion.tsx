import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type AccordionProps = {
  children: React.ReactNode
  headerButton?: React.ReactNode
  isExpanded: boolean
  setExpandedAccordion: () => void
  title: string
}

export function Accordion({ children, headerButton, isExpanded, setExpandedAccordion, title }: AccordionProps) {
  return (
    <AccordionContainer $withCursor={!headerButton}>
      <AccordionHeader onClick={!headerButton ? setExpandedAccordion : undefined}>
        <TitleContainer>
          <Title>{title}</Title>
          {headerButton}
        </TitleContainer>
        <StyledIconButton
          $isExpanded={isExpanded}
          accent={Accent.TERTIARY}
          Icon={Icon.Chevron}
          onClick={setExpandedAccordion}
          size={Size.SMALL}
        />
      </AccordionHeader>
      <HeaderSeparator />
      <AccordionContent $isExpanded={isExpanded}>{children}</AccordionContent>
    </AccordionContainer>
  )
}

const AccordionContainer = styled.div<{ $withCursor: boolean }>`
  box-shadow: 0px 3px 6px #70778540;
  cursor: ${({ $withCursor }) => ($withCursor ? 'pointer' : 'default')};
  width: 571px;
`
const StyledIconButton = styled(IconButton)<{ $isExpanded: boolean }>`
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s;
`
const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px;
`
const TitleContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 16px;
`
const Title = styled.span`
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
  max-height: ${({ $isExpanded }) => ($isExpanded ? '100vh' : '0px')};
  overflow-x: hidden;
  transition: 0.5s max-height;
`
