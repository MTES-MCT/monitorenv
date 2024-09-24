import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type AccordionProps = {
  children: React.ReactNode
  isExpanded: boolean
  isReadOnly?: boolean
  setExpandedAccordion: () => void
  title: string
}

export function SmallAccordion({
  children,
  isExpanded,
  isReadOnly = false,
  setExpandedAccordion,
  title
}: AccordionProps) {
  return (
    <AccordionContainer>
      <AccordionHeader onClick={setExpandedAccordion}>
        <TitleContainer>
          <Title>{title}</Title>
        </TitleContainer>
        {!isReadOnly && (
          <StyledIconButton
            $isExpanded={isExpanded}
            accent={Accent.TERTIARY}
            Icon={Icon.Chevron}
            onClick={setExpandedAccordion}
          />
        )}
      </AccordionHeader>
      <AccordionContent $isExpanded={isExpanded}>{children}</AccordionContent>
    </AccordionContainer>
  )
}

const AccordionContainer = styled.div`
  background-color: ${p => p.theme.color.blueGray25};
  box-shadow: 0px 3px 6px #70778540;
  cursor: pointer;
  padding-bottom: 4px;
`
const StyledIconButton = styled(IconButton)<{ $isExpanded: boolean }>`
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s;
`
const AccordionHeader = styled.header`
  color: ${p => p.theme.color.blueYonder};
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 8px 24px;
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
