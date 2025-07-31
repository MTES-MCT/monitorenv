import { getControlUnitsByIds } from '@api/controlUnitsAPI'
import { Tooltip } from '@components/Tooltip'
import { PanelSource } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/PanelSource'
import { EMPTY_VALUE } from '@features/VigilanceArea/constants'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { THEME } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { Fragment } from 'react/jsx-runtime'
import styled from 'styled-components'

import {
  PanelInlineItem,
  PanelInlineItemLabel,
  PanelInlineItemValue,
  PanelInternText,
  PanelItem,
  PanelSubPart
} from '../style'

export function PanelInternalCACEMSection({
  createdBy,
  sources = []
}: {
  createdBy: string | undefined
  sources?: VigilanceArea.VigilanceAreaSource[]
}) {
  const controlUnitIds = sources.flatMap(
    source => source.controlUnitContacts?.flatMap(contact => contact.controlUnitId) ?? []
  )
  const controlUnits = useAppSelector(state => getControlUnitsByIds(state, controlUnitIds))
  const getControlUnitName = (controlUnitId: number) => {
    const unit = controlUnits.find(controlUnit => controlUnit.id === controlUnitId)

    return `${unit?.name} (${unit?.administration?.name})`
  }

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
      {sources.length > 0 && (
        <PanelInlineItem>
          <PanelInlineItemLabel>Sources</PanelInlineItemLabel>
          <PanelItem>
            {sources.map((source, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={index}>
                {(source.controlUnitContacts?.length ?? 0) > 0 ? (
                  <>
                    {Object.entries(groupBy(source.controlUnitContacts, item => item.controlUnitId)).map(
                      ([controlUnitId, contacts]) => (
                        <div key={`control-unit-source-${controlUnitId}`}>
                          <PanelSource name={getControlUnitName(+controlUnitId)} />
                          {contacts.map(contact => (
                            <PanelSource
                              key={`control-unit-contact-source-${contact.id}`}
                              email={contact.email}
                              phone={contact.phone}
                            />
                          ))}
                        </div>
                      )
                    )}
                  </>
                ) : (
                  <PanelSource email={source.email} name={source.name} phone={source.phone} />
                )}
              </Fragment>
            ))}
          </PanelItem>
        </PanelInlineItem>
      )}
    </PanelSubPart>
  )
}

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`
