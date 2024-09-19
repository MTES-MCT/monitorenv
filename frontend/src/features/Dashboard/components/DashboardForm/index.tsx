import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useState } from 'react'

import { Accordion } from './Accordion'

export function DashboardForm() {
  const extractedArea = useAppSelector(state => state.dashboard.extractedArea)

  const [expandedAccordion, setExpandedAccordion] = useState<number>(0)

  const handleAccordionClick = (index: number) => {
    if (expandedAccordion === index) {
      setExpandedAccordion(0)

      return
    }
    setExpandedAccordion(index)
  }

  const clickOnEye = () => {}

  return (
    <div>
      <Accordion
        headerButton={<IconButton accent={Accent.TERTIARY} Icon={Icon.Hide} onClick={clickOnEye} />}
        isExpanded={expandedAccordion === 1}
        setExpandedAccordion={() => handleAccordionClick(1)}
        title="Zones réglementaires"
      >
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
      </Accordion>
      <Accordion
        isExpanded={expandedAccordion === 2}
        setExpandedAccordion={() => handleAccordionClick(2)}
        title="Zones AMP"
      >
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
      </Accordion>
      <Accordion
        isExpanded={expandedAccordion === 3}
        setExpandedAccordion={() => handleAccordionClick(3)}
        title="Zones de vigilance"
      >
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
        <div>TEST</div>
      </Accordion>
    </div>
  )
}
