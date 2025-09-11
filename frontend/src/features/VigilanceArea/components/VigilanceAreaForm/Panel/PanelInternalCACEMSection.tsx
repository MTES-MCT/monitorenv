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

  const internalSources = sources.filter(source => source.type === VigilanceArea.VigilanceAreaSourceType.INTERNAL)

  const externalSources = sources.filter(source => source.type !== VigilanceArea.VigilanceAreaSourceType.INTERNAL)

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
      {externalSources.length > 0 && (
        <PanelInlineItem>
          <PanelInlineItemLabel>Sources externes</PanelInlineItemLabel>
          <PanelItem>
            {externalSources.map((source, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={index}>
                {source.type === VigilanceArea.VigilanceAreaSourceType.CONTROL_UNIT ? (
                  <>
                    {Object.entries(groupBy(source.controlUnitContacts, item => item.controlUnitId)).map(
                      ([controlUnitId, contacts]) => (
                        <div key={`control-unit-source-${controlUnitId}`}>
                          <PanelSource
                            isAnonymous={source.isAnonymous}
                            isReadOnly
                            name={getControlUnitName(+controlUnitId)}
                          />
                          {contacts.map(contact => (
                            <PanelSource
                              key={`control-unit-contact-source-${contact.id}`}
                              comments={source.comments}
                              email={contact.email}
                              isReadOnly
                              phone={contact.phone}
                            />
                          ))}
                        </div>
                      )
                    )}
                  </>
                ) : (
                  <PanelSource
                    comments={source.comments}
                    email={source.email}
                    isAnonymous={source.isAnonymous}
                    isReadOnly
                    link={source.link}
                    name={source.name}
                    phone={source.phone}
                  />
                )}
              </Fragment>
            ))}
          </PanelItem>
        </PanelInlineItem>
      )}
      {internalSources.length > 0 && (
        <PanelInlineItem>
          <StyledPanelInlineItemLabel>Sources CACEM</StyledPanelInlineItemLabel>
          <PanelItem>
            {internalSources.map((source, index) => (
              <PanelSource
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                comments={source.comments}
                email={source.email}
                isAnonymous={source.isAnonymous}
                isReadOnly
                link={source.link}
                name={source.name}
                phone={source.phone}
              />
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
const StyledPanelInlineItemLabel = styled(PanelInlineItemLabel)`
  width: 70px;
`
