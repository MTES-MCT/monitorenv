import { getOptionsFromLabelledEnum, MultiRadio, TextInput, Toggle } from '@mtes-mct/monitor-ui'
import { displaySubTags, displayTags } from '@utils/getTagsAsOptions'
import { displaySubThemes } from '@utils/getThemesAsOptions'
import {
  ReportingSourceEnum,
  ReportingSourceLabels,
  ReportingTypeLabels,
  type Reporting
} from 'domain/entities/reporting'
import { ReportingTargetTypeLabels } from 'domain/entities/targetType'
import { vehicleTypeLabels } from 'domain/entities/vehicleType'
import styled from 'styled-components'

import { Location } from './Location'
import { TargetDetails } from './TargetDetails'
import { Validity } from './Validity'

const EMPTY_VALUE = '--'

export function FormContent({ isSuperUser = true, reporting }: { isSuperUser?: boolean; reporting: Reporting }) {
  const sourceOptions = getOptionsFromLabelledEnum(ReportingSourceLabels)
  const reportTypeOptions = getOptionsFromLabelledEnum(ReportingTypeLabels)

  const sourceTypeText = (sourceType: ReportingSourceEnum) => {
    if (sourceType === ReportingSourceEnum.SEMAPHORE) {
      return 'Nom du sémpahore'
    }
    if (sourceType === ReportingSourceEnum.CONTROL_UNIT) {
      return "Nom de l'unité"
    }

    return 'Nom, société ...'
  }

  return (
    <>
      <FirstPartContainer>
        {reporting.reportingSources?.map((reportingSource, index) => (
          <SourceContainer key={reportingSource.id}>
            <MultiRadio
              isInline
              label={`Source (${index + 1})`}
              name="sourceType"
              options={sourceOptions}
              readOnly
              value={reportingSource.sourceType}
            />

            <TextInput
              label={sourceTypeText(reportingSource.sourceType)}
              name="source"
              plaintext
              value={reportingSource.displayedSource}
            />
          </SourceContainer>
        ))}

        <TargetContainer>
          <TextInput
            label="Type de cible"
            name="description"
            plaintext
            value={reporting.targetType ? ReportingTargetTypeLabels[reporting.targetType] : EMPTY_VALUE}
          />
          <TextInput
            label="Type de véhicule"
            name="description"
            plaintext
            value={reporting.vehicleType ? vehicleTypeLabels[reporting.vehicleType].label : EMPTY_VALUE}
          />
        </TargetContainer>

        <TargetDetails isSuperUser={isSuperUser} reporting={reporting} />
        <Location geom={reporting.geom} />
        <TextInput
          isLight
          label="Description du signalement"
          name="description"
          plaintext
          value={reporting.description ?? 'Aucune description'}
        />
      </FirstPartContainer>
      <div>
        <AdditionnalInformations>COMPLEMENTS D&apos;INFORMATIONS</AdditionnalInformations>
        <Line />
        <AdditionnalInformationsContainer>
          <ReportTypeMultiRadio
            isInline
            label="Type de signalement"
            name="reportType"
            options={reportTypeOptions}
            readOnly
            value={reporting.reportType}
          />
          <TextInput label="Thématique du signalement" name="theme" plaintext value={reporting.theme.name} />
          <TextInput
            label="Sous-thématique du signalement"
            name="subTheme"
            plaintext
            value={displaySubThemes([reporting.theme]) || EMPTY_VALUE}
          />
          <TextInput
            label="Tags du signalement"
            name="tags"
            plaintext
            value={displayTags(reporting.tags) || EMPTY_VALUE}
          />
          <TextInput
            label="Sous-tag du signalement"
            name="subTag"
            plaintext
            value={displaySubTags(reporting.tags) || EMPTY_VALUE}
          />
          <Validity reporting={reporting} />
          {isSuperUser && (
            <TextInput
              label="Actions effectuées"
              name="actionTaken"
              plaintext
              value={reporting.actionTaken ?? 'Aucune description'}
            />
          )}
          <StyledToggle>
            <Toggle
              checked={reporting.isControlRequired ?? false}
              isLabelHidden
              label="Le signalement nécessite un contrôle"
              name="isControlRequired"
              onChange={() => {}}
              readOnly
            />
            <span>Le signalement nécessite un contrôle</span>
          </StyledToggle>
          {isSuperUser && (
            <TextInput
              label="Saisi par"
              maxLength={3}
              name="openBy"
              plaintext
              value={reporting.openBy || EMPTY_VALUE}
            />
          )}
        </AdditionnalInformationsContainer>
      </div>
    </>
  )
}
const FirstPartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const SourceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const TargetContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
`

const AdditionnalInformations = styled.h6`
  padding-top: 32px;
  color: ${p => p.theme.color.slateGray};
`
const Line = styled.div`
  border-top: 2px solid ${p => p.theme.color.slateGray};
  padding-bottom: 24px;
`
const AdditionnalInformationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`
const ReportTypeMultiRadio = styled(MultiRadio)`
  > div > div > div:first-child label::after {
    color: ${({ theme }) => theme.color.maximumRed};
    content: ' ●';
  }
  > div > div > div:last-child label::after {
    color: ${({ theme }) => theme.color.blueGray};
    content: ' ●';
  }
`
export const StyledToggle = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
`
