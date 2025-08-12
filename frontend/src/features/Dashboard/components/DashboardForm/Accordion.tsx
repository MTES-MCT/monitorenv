import { TransparentButton } from '@components/style'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { type ForwardedRef, type ReactNode } from 'react'
import styled from 'styled-components'

type AccordionProps = {
  children: ReactNode
  className?: string
  controls?: ReactNode
  isExpanded: boolean
  name?: string
  setExpandedAccordion: () => void
  title: ReactNode
  titleRef?: ForwardedRef<HTMLDivElement>
}

export function Accordion({
  children,
  className,
  controls,
  isExpanded,
  name,
  setExpandedAccordion,
  title,
  titleRef
}: AccordionProps) {
  return (
    <AccordionContainer className={className}>
      <AccordionHeader ref={titleRef} onClick={setExpandedAccordion}>
        <TransparentButton aria-controls={`${name}-accordion`} aria-expanded={isExpanded}>
          {title}
        </TransparentButton>
        {controls}
        <StyledIconButton
          $isExpanded={isExpanded}
          accent={Accent.TERTIARY}
          data-cy={`accordion-${name ?? title}-toggle`}
          Icon={Icon.Chevron}
          onClick={setExpandedAccordion}
          title={isExpanded ? 'Replier le contenu' : 'Déplier le contenu'}
        />
      </AccordionHeader>
      <HeaderSeparator />
      <AccordionContent $isExpanded={isExpanded} id={`${name ?? title}-accordion`}>
        <Wrapper>{children}</Wrapper>
      </AccordionContent>
    </AccordionContainer>
  )
}

export const AccordionContainer = styled.div`
  box-shadow: 0px 3px 6px #70778540;
  width: 100%;
`
export const StyledIconButton = styled(IconButton)<{ $isExpanded: boolean }>`
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s;
`
export const AccordionHeader = styled.header`
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr auto auto;
  justify-content: space-between;
  padding: 21px 24px;
`
export const TitleContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
`
export const Title = styled.h2`
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
