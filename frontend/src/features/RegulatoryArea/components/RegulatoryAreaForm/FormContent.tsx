import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { Tooltip } from '@components/Tooltip'
import {
  Accent,
  Button,
  FormikDatePicker,
  FormikSelect,
  FormikTextarea,
  FormikTextInput,
  Icon,
  IconButton,
  Label,
  Select,
  TextInput,
  THEME
} from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useState } from 'react'
import styled from 'styled-components'

import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'

const layernameOptions = [
  { label: 'Zone de protection', value: 'zone_de_protection' },
  { label: 'Zone de réglementation', value: 'zone_de_reglementation' },
  { label: 'Zone de conservation', value: 'zone_de_conservation' }
]

const geomOptions = [
  {
    label: '1',
    value: {
      id: 1,
      refReg: 'Arrete 1'
    }
  },
  {
    label: '2',
    value: {
      id: 2,
      refReg: 'Arrete 2'
    }
  }
]

const regulatoryTypeOptions = [
  { label: 'Arrêté préfectoral', value: 'arrete_prefectoral' },
  { label: 'Zone de réglementation', value: 'zone_de_reglementation' },
  { label: 'Zone de conservation', value: 'zone_de_conservation' }
]

export function FormContent() {
  const { values } = useFormikContext<RegulatoryLayerWithMetadata>()
  const [isEditingRefRegId, setIsEditingRefRegId] = useState<number | undefined>(undefined)

  const cancelEditRefReg = () => {
    setIsEditingRefRegId(undefined)
  }

  const validateRefReg = () => {
    setIsEditingRefRegId(undefined)
  }

  return (
    <>
      <SubTitle>IDENTIFICATION DE LA ZONE RÉGLEMENTAIRE</SubTitle>
      <IdentificationContainer>
        <FieldWithTooltip>
          <FormikTextInput isRequired label="Titre de la zone réglementaire" name="polyName" style={{ flex: 1 }} />
          <Tooltip>
            Le titre de la zone doit être le plus explicite possible que le rendre intelligible à tous, même à des
            utilisateurs non experts sur différents sujets (ex : biodiversité), tels que les utilisateurs de MonitorExt.
          </Tooltip>
        </FieldWithTooltip>
        <FieldWithTooltip>
          <FormikSelect
            isRequired
            label="Titre du groupe de réglementation"
            name="layerName"
            options={layernameOptions}
            renderExtraFooter={() => (
              <ExtraFooterContainer>
                <Icon.Plus />
                Ajouter un nouveau groupe
              </ExtraFooterContainer>
            )}
            style={{ flex: 1 }}
          />
          <Tooltip>Le nom du groupe doit permettre de connaître le lieu et le sujet de la réglementation.</Tooltip>
        </FieldWithTooltip>
        <InlineFieldsContainer>
          <Select
            isRequired
            label="Géométrie"
            name="geom"
            options={geomOptions}
            optionValueKey="id"
            style={{ width: '30%' }}
          />
          <TextInput isRequired label="Façade" name="facade" style={{ width: '30%' }} />
          <FormikSelect
            isRequired
            label="Ensemble réglementaire"
            name="type"
            options={regulatoryTypeOptions}
            style={{ width: '40%' }}
          />
        </InlineFieldsContainer>
        <div>
          <InlineFieldsContainer>
            <RegulatoryThemesFilter
              isLabelHidden={false}
              isRequired
              isTransparent={false}
              label="Thématiques et sous-thématiques"
              onChange={() => {}}
              style={{ width: '50%' }}
              value={values?.themes ?? []}
            />
            <RegulatoryTagsFilter
              isLabelHidden={false}
              isRequired
              isTransparent={false}
              label="Tags et sous-tags"
              onChange={() => {}}
              style={{ width: '50%' }}
              value={values?.tags ?? []}
            />
          </InlineFieldsContainer>
          <InformationMessage>
            Sélectionner au moins une thématique/sous-thématique ou un tag/sous-tag
          </InformationMessage>
        </div>
        <div>
          <FormikTextarea label="Résumé" name="resume" rows={4} />
          <InformationMessage>
            Le résumé concerne tout ce qui n’est pas une période. Les périodes sont à renseigner plus bas.
          </InformationMessage>
        </div>
      </IdentificationContainer>
      <SubTitle>TEXTE(S) RÉGLEMENTAIRE(S) EN VIGUEUR</SubTitle>

      {!isEditingRefRegId ? (
        <RefRegContainer>
          <div>
            <RefRegText>{values?.refReg} </RefRegText>
            <Link href={values?.url}>{values?.url}</Link>
            <PeriodText>
              En vigueur depuis
              <span> 01/01/2023</span>
            </PeriodText>
          </div>
          <IconButton accent={Accent.TERTIARY} Icon={Icon.Edit} onClick={() => setIsEditingRefRegId(values?.id)} />
        </RefRegContainer>
      ) : (
        <EditingRefRegContainer>
          <div>
            <Label>Titre de la réglementation</Label>
            <RefRegText>{values.refReg} </RefRegText>
          </div>

          <RefRegSecondLine>
            <FormikTextInput isLight label="URL du lien" name="url" style={{ width: '65%' }} />
            <DateContainer>
              <FormikDatePicker isLight isRequired label="Début de validité" name="startDate" />
              <FormikDatePicker isLight isRequired label="Fin de validité" name="endDate" />
            </DateContainer>
          </RefRegSecondLine>
          <ButtonsWrapper>
            <Button accent={Accent.SECONDARY} onClick={cancelEditRefReg}>
              Annuler
            </Button>
            <ValidateButton onClick={validateRefReg}>Valider</ValidateButton>
          </ButtonsWrapper>
        </EditingRefRegContainer>
      )}

      <SubTitle>PÉRIODE(S)</SubTitle>
      <PeriodContainer>
        <Period>
          <Label>
            <StyledIcon color={THEME.color.mediumSeaGreen} size={10} />
            Période d&apos;autorisation
          </Label>
          <FormikTextarea
            isLabelHidden
            label="Période autorisée"
            name="authorizePeriod"
            placeholder="Détail de la période d’autorisation"
          />
        </Period>
        <Period>
          <Label>
            <StyledIcon color={THEME.color.maximumRed} size={10} />
            Période d&apos;interdiction
          </Label>
          <FormikTextarea
            isLabelHidden
            label="Période d'interdiction"
            name="forbidPeriod"
            placeholder="Détail de la période d’interdiction"
          />
        </Period>
      </PeriodContainer>
    </>
  )
}

const SubTitle = styled.h2`
  border-bottom: 1px solid ${THEME.color.lightGray};
  font-size: 16px;
  color: ${THEME.color.slateGray};
  margin-bottom: 16px;
  margin-top: 24px;
  padding-top: 10px;
  padding-bottom: 10px;
`

const InlineFieldsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`
const FieldWithTooltip = styled.div`
  align-items: end;
  display: flex;
  flex: 1;
  gap: 8px;
`

const ExtraFooterContainer = styled.div`
  align-items: center;
  border-top: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  gap: 8px;
  padding: 8px;
`

const InformationMessage = styled.span`
  font-style: italic;
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
`

const RefRegContainer = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;

  gap: 16px;
  padding: 8px;
`

const EditingRefRegContainer = styled(RefRegContainer)`
  flex-direction: column;
`

const RefRegSecondLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const RefRegText = styled.p`
  font-size: 13px;
`

const ValidateButton = styled(Button)`
  background: ${p => p.theme.color.mediumSeaGreen};
  border: 1px ${p => p.theme.color.mediumSeaGreen} solid;
  color: ${p => p.theme.color.white};
  &:not(:disabled):hover {
    background: ${p => p.theme.color.mediumSeaGreen};
    border: 1px ${p => p.theme.color.mediumSeaGreen} solid;
  }
`

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

const DateContainer = styled.div`
  display: flex;
  gap: 8px;
`
const PeriodContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 94px;
`

const Period = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const StyledIcon = styled(Icon.CircleFilled)`
  margin-right: 8px;
`

const IdentificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Link = styled.a`
  color: ${p => p.theme.color.blueGray};
  font-size: 13px;
  text-decoration: underline;
`

const PeriodText = styled.p`
  font-size: 13px;
  color: ${p => p.theme.color.slateGray};
  > span {
    color: ${p => p.theme.color.gunMetal};
  }
`
