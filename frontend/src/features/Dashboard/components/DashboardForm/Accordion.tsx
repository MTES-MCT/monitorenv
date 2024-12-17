import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { type ForwardedRef, type ReactNode } from 'react'
import styled from 'styled-components'

type AccordionProps = {
  children: ReactNode
  isExpanded: boolean
  name?: string
  setExpandedAccordion: () => void
  title: string | ReactNode
  titleRef?: ForwardedRef<HTMLDivElement>
}

export function Accordion({ children, isExpanded, name, setExpandedAccordion, title, titleRef }: AccordionProps) {
  return (
    <AccordionContainer>
      <AccordionHeader
        ref={titleRef}
        aria-controls={`${title}-accordion`}
        aria-expanded={isExpanded}
        onClick={setExpandedAccordion}
      >
        <TitleContainer>
          <Title>{title}</Title>
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
        <Wrapper>{children}</Wrapper>
      </AccordionContent>
    </AccordionContainer>
  )
}

const AccordionContainer = styled.div`
  box-shadow: 0px 3px 6px #70778540;
  width: 100%;
`
const StyledIconButton = styled(IconButton)<{ $isExpanded: boolean }>`
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s;
`
const AccordionHeader = styled.header`
  cursor: pointer;
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
  font-weight: 700;
`

const HeaderSeparator = styled.div`
  border-bottom: 2px solid ${p => p.theme.color.gainsboro};
  padding: -24px;
`
const AccordionContent = styled.div<{ $isExpanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isExpanded }) => ($isExpanded ? '1fr' : '0fr')};
  transition: ${({ $isExpanded }) =>
    $isExpanded ? '0.5s grid-template-rows ease-in' : '0.3s grid-template-rows ease-out'};
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  overflow: hidden;
`
