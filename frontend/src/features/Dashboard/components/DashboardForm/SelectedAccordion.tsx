import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type SelectedAccordionProps = {
  children: React.ReactNode
  isExpanded: boolean
  isReadOnly?: boolean
  setExpandedAccordion: () => void
  title: string
}

export function SelectedAccordion({
  children,
  isExpanded,
  isReadOnly = false,
  setExpandedAccordion,
  title
}: SelectedAccordionProps) {
  return (
    <AccordionContainer>
      <AccordionHeader
        aria-controls={`selected-${title}-accordion`}
        aria-expanded={isExpanded}
        onClick={setExpandedAccordion}
      >
        <Title>{title}</Title>
        {!isReadOnly && (
          <StyledIconButton
            $isExpanded={isExpanded}
            accent={Accent.TERTIARY}
            Icon={Icon.Chevron}
            onClick={setExpandedAccordion}
          />
        )}
      </AccordionHeader>
      <AccordionContent $isExpanded={isExpanded} id={`selected-${title}-accordion`}>
        {children}
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
  color: ${p => p.theme.color.blueYonder};
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 4px 24px 2px 24px;
`

const Title = styled.span`
  font-size: 13px;
  font-weight: 500;
`

const AccordionContent = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  max-height: ${({ $isExpanded }) => ($isExpanded ? '100vh' : '0px')};
  overflow-x: hidden;
  transition: 0.5s max-height;
  & > :last-child {
    border-bottom: none;
  }
`
