/* eslint-disable react/destructuring-assignment */

import { PlanningBody } from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/PlanningBody'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import React from 'react'
import styled from 'styled-components'

import { Header, PanelBody, PanelContainer, Title, TitleContainer } from '../style'

export function PlanningPanel() {
  const { values: vigilanceArea } = useFormikContext<VigilanceArea.VigilanceArea>()

  const [isOpen, setIsOpen] = React.useState(true)

  if (!vigilanceArea) {
    return null
  }

  return isOpen ? (
    <StyledPanelContainer>
      <Header $isEditing>
        <StyledTitleContainer>
          <Title>Planning de vigilance</Title>
          <IconButton
            accent={Accent.TERTIARY}
            Icon={Icon.Close}
            onClick={() => setIsOpen(false)}
            size={Size.SMALL}
            title="Fermer le planning"
          />
        </StyledTitleContainer>
      </Header>
      <StyledPanelBody>
        <PlanningBody vigilanceArea={vigilanceArea} />
      </StyledPanelBody>
    </StyledPanelContainer>
  ) : (
    <ShowPlanningPanel
      accent={Accent.PRIMARY}
      Icon={Icon.Calendar}
      onClick={() => setIsOpen(true)}
      size={Size.LARGE}
      title="Ouvrir le planning"
    />
  )
}

const StyledTitleContainer = styled(TitleContainer)`
  justify-content: space-between;
  width: 100%;
`
const StyledPanelContainer = styled(PanelContainer)`
  max-height: calc(100vh - 65px);
  height: fit-content;
`

const StyledPanelBody = styled(PanelBody)`
  padding: 16px;
`

const ShowPlanningPanel = styled(IconButton)`
  height: 40px;
  width: 40px;
`
