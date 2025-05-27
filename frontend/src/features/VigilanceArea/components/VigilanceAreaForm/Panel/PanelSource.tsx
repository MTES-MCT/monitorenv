import { Tooltip } from '@components/Tooltip'
import { EMPTY_VALUE } from '@features/VigilanceArea/constants'
import { THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { PanelInlineItem, PanelInlineItemLabel, PanelInlineItemValue, PanelInternText, PanelSubPart } from '../style'

export function PanelSource({ createdBy, source }: { createdBy: string | undefined; source: string | undefined }) {
  return (
    <PanelSubPart data-cy="vigilance-area-panel-source">
      <Wrapper>
        <PanelInternText>Section interne CACEM</PanelInternText>
        <Tooltip color={THEME.color.maximumRed}>
          Même si la visibilité de la zone de vigilance est publique, les infos de cette section &quot;Interne
          CACEM&quot; ne seront pas visibles sur la version de MonitorEnv utilisée hors du centre.
        </Tooltip>
      </Wrapper>
      <PanelInlineItem>
        <PanelInlineItemLabel>Créé par</PanelInlineItemLabel>
        <PanelInlineItemValue>{createdBy ?? EMPTY_VALUE}</PanelInlineItemValue>
      </PanelInlineItem>
      {source && (
        <PanelInlineItem>
          <PanelInlineItemLabel>Source</PanelInlineItemLabel>
          <PanelInlineItemValue $maxLine={2} title={source}>
            {source}
          </PanelInlineItemValue>
        </PanelInlineItem>
      )}
    </PanelSubPart>
  )
}

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`
