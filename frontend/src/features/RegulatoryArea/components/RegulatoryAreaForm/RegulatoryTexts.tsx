import { SubSubTitle, SubTitle } from '@features/RegulatoryArea/components/RegulatoryAreaForm/style'
import { SubTitleWrapper } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/index'
import { ReadOnlyOtherRefRegText } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/ReadOnlyOtherRefRegText'
import { ReadOnlyRefRegText } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/ReadOnlyRefRegText'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import { Button, getOptionsFromLabelledEnum, Select } from '@mtes-mct/monitor-ui'
import { noop } from 'lodash'
import styled from 'styled-components'

import { OtherRefRegContainer } from '../RegulatoryAreaGroupForm/OtherRefRegForm'

export function RegulatoryTexts({ regulatoryAreaGroup }: { regulatoryAreaGroup: RegulatoryArea.RegulatoryAreaGroup }) {
  const regulatoryTypeOptions = getOptionsFromLabelledEnum(RegulatoryArea.RegulatoryAreaTypeLabel).sort((a, b) =>
    a.label.localeCompare(b.label)
  )

  return (
    <div>
      <SubTitleWrapper>
        <StyledSubTitle>TEXTE(S) RÉGLEMENTAIRE(S) EN VIGUEUR</StyledSubTitle>
        <Button disabled onClick={noop}>
          Ajouter un texte supplémentaire
        </Button>
      </SubTitleWrapper>
      <Fields>
        <Information>Les informations de cette section sont renseignées au niveau du groupe.</Information>
        <Select
          isRequired
          label="Type d’acte administratif"
          name="type"
          options={regulatoryTypeOptions}
          readOnly
          value={regulatoryAreaGroup.group.type}
        />
        <ReadOnlyRefRegText
          date={regulatoryAreaGroup.group.date}
          dateFin={regulatoryAreaGroup.group.dateFin}
          refReg={regulatoryAreaGroup.group.refReg}
          url={regulatoryAreaGroup.group.url}
        />
        <section>
          {regulatoryAreaGroup.group?.additionalRefReg?.length && (
            <div>
              <Separator />
              <SubSubTitle>Textes supplémentaires</SubSubTitle>
            </div>
          )}
          <OtherRefRegContainer>
            {regulatoryAreaGroup.group.additionalRefReg?.map(otherRefReg => (
              <ReadOnlyOtherRefRegText
                key={otherRefReg.id}
                endDate={otherRefReg.endDate}
                refReg={otherRefReg.refReg}
                startDate={otherRefReg.startDate}
              />
            ))}
          </OtherRefRegContainer>
        </section>
      </Fields>
    </div>
  )
}

const StyledSubTitle = styled(SubTitle)`
  border-bottom: none;
  margin-bottom: 0;
  margin-top: 0;
`

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const Separator = styled.div`
  border-top: ${p => `1px solid ${p.theme.color.lightGray}`};
`
const Information = styled.p`
  color: ${p => p.theme.color.slateGray};
  font-style: italic;
`
