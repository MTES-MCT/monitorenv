import { Accent, Button, Icon, MultiRadio, TextInput, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useMemo } from 'react'
import { Toggle } from 'rsuite'
import styled from 'styled-components'

import { Localization } from './Localization'
import { TargetDetails } from './TargetDetails'
import { Validity } from './Validity'
import { ReportingSourceEnum, ReportingTypeLabels } from '../../../../../domain/entities/reporting'
import {
  type ReportingDetailed,
  ReportingSourceLabels,
  getFormattedReportingId
} from '../../../../../domain/entities/reporting'
import { ReportingTargetTypeLabels } from '../../../../../domain/entities/targetType'
import { vehicleTypeLabels } from '../../../../../domain/entities/vehicleType'

const EMPTY_VALUE = '--'

export function ReportingForm({ reportingActionIndex }) {
  const [reportingField] = useField<ReportingDetailed>(`reportings.${reportingActionIndex}`)

  const reporting = reportingField.value
  const sourceOptions = getOptionsFromLabelledEnum(ReportingSourceLabels)
  const reportTypeOptions = getOptionsFromLabelledEnum(ReportingTypeLabels)

  const subThemes =
    reporting.subThemes && reporting.subThemes?.length > 0 ? reporting.subThemes.join(', ') : EMPTY_VALUE

  const sourceTypeText = useMemo(() => {
    if (reporting.sourceType === ReportingSourceEnum.SEMAPHORE) {
      return 'Nom du sémpahore'
    }
    if (reporting.sourceType === ReportingSourceEnum.CONTROL_UNIT) {
      return "Nom de l'unité"
    }

    return 'Nom, société ...'
  }, [reporting.sourceType])

  return (
    <>
      <Header>
        <Title>{`Signalement ${getFormattedReportingId(reporting.reportingId)}`}</Title>
        <Button accent={Accent.SECONDARY} Icon={Icon.Unlink}>
          Délier de la mission
        </Button>
      </Header>
      <FirstPartContainer>
        <SourceContainer>
          <MultiRadio
            isInline
            isReadOnly
            label="Source"
            name="sourceType"
            options={sourceOptions}
            value={reporting.sourceType}
          />
          <TextInput label={sourceTypeText} name="source" plaintext value={reporting.displayedSource} />
        </SourceContainer>
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

        <TargetDetails reporting={reporting} />
        <Localization geom={reporting.geom} />

        <TextInput
          isLight
          label="Description du signalement"
          name="description"
          plaintext
          value={reporting.description || 'Aucune description'}
        />
      </FirstPartContainer>
      <div>
        <AdditionnalInformations>COMPLEMENTS D&apos;INFORMATIONS</AdditionnalInformations>
        <Line />
        <AdditionnalInformationsContainer>
          <ReportTypeMultiRadio
            isInline
            isReadOnly
            label="Type de signalement"
            name="reportType"
            options={reportTypeOptions}
            value={reporting.reportType}
          />
          <TextInput label="Thématique du signalement" name="theme" plaintext value={reporting.theme || EMPTY_VALUE} />
          <TextInput label="Sous-thématique du signalement" name="subThemes" plaintext value={subThemes} />
          <Validity reporting={reporting} />
          <TextInput
            label="Actions effectuées"
            name="actionTaken"
            plaintext
            value={reporting.actionTaken || 'Aucune description'}
          />
          <StyledToggle>
            <Toggle checked={reporting.isControlRequired} readOnly />
            <span>Le signalement nécessite un contrôle</span>
          </StyledToggle>
          <TextInput label="Saisi par" name="openBy" plaintext value={reporting.openBy || EMPTY_VALUE} />
        </AdditionnalInformationsContainer>
      </div>
    </>
  )
}

const Header = styled.div`
  padding-bottom: 40px;
  display: flex;
  justify-content: space-between;
`

const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  display: inline-block;
  color: ${p => p.theme.color.charcoal};
`
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
export const StyledVesselForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  > .Field-TextInput,
  .Field-NumberInput {
    flex: 1;
  }
`
const AdditionnalInformations = styled.h4`
  padding-top: 58px;
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
  > .rs-toggle-checked .rs-toggle-presentation {
    background-color: ${p => p.theme.color.gunMetal};
  }
`
