import { useGetRegulatoryLayerByIdQuery } from '@api/regulatoryLayersAPI'
import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { Title } from '@features/BackOffice/components/style'
import { MapAttributionsBox } from '@features/map/controls/MapAttributionsBox'
import { MapCoordinatesBox } from '@features/map/controls/MapCoordinatesBox'
import { MapLayer } from '@features/map/layers/MapLayer'
import { MapExtentController } from '@features/map/MapExtentController'
import { ZoomListener } from '@features/map/ZoomListener'
import { MapContainer, RegulatoryWrapper, StyledBackofficeWrapper } from '@features/RegulatoryArea/style'
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
  LinkButton,
  Select,
  TextInput,
  THEME
} from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { BackofficeRegulatoryAreaLayer } from '../Layers/BackofficeRegulatoryAreaLayer'

const childrensComponents = [
  // @ts-ignore
  <ZoomListener key="ZoomListener" />,
  <MapAttributionsBox key="MapAttributionsBox" />,
  // @ts-ignore
  <MapCoordinatesBox key="MapCoordinatesBox" />,
  // @ts-ignore
  <BackofficeRegulatoryAreaLayer key="BackofficeRegulatoryAreaLayer" />,
  // @ts-ignore
  <MapExtentController key="MapExtentController" />,
  <MapLayer key="MapLayer" />
]

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

export function RegulatoryAreaForm() {
  const navigate = useNavigate()
  const { regulatoryAreaId } = useParams()
  const [isEditingRefRegId, setIsEditingRefRegId] = useState<number | undefined>(undefined)

  const { currentData: regulatoryArea } = useGetRegulatoryLayerByIdQuery(Number(regulatoryAreaId), {
    skip: !regulatoryAreaId
  })

  const initialValues = useMemo(
    () => ({
      facade: regulatoryArea?.facade ?? '',
      geom: regulatoryArea?.geom ?? null,
      id: regulatoryArea?.id ?? '',
      layerName: regulatoryArea?.layerName ?? '',
      polyName: regulatoryArea?.polyName ?? '',
      refReg: regulatoryArea?.refReg ?? '',
      resume: regulatoryArea?.resume ?? '',
      tags: regulatoryArea?.tags ?? [],
      themes: regulatoryArea?.themes ?? [],
      type: regulatoryArea?.type ?? ''
    }),
    [regulatoryArea]
  )

  const onBackToList = () => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}`)
  }

  return (
    <>
      <StyledBackofficeWrapper>
        <RegulatoryWrapper>
          <StyledLinkButton Icon={Icon.Chevron} onClick={onBackToList}>
            Revenir à la liste des zones réglementaires
          </StyledLinkButton>

          <Title>Saisir une zone réglementaire</Title>
          <Formik key={regulatoryAreaId} enableReinitialize initialValues={initialValues} onSubmit={() => {}}>
            <>
              <SubTitle>IDENTIFICATION DE LA ZONE RÉGLEMENTAIRE</SubTitle>
              <IdentificationContainer>
                <FormikTextInput isRequired label="Titre de la zone réglementaire" name="polyName" />
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
                />
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
                      value={regulatoryArea?.themes ?? []}
                    />
                    <RegulatoryTagsFilter
                      isLabelHidden={false}
                      isRequired
                      isTransparent={false}
                      label="Tags et sous-tags"
                      onChange={() => {}}
                      style={{ width: '50%' }}
                      value={regulatoryArea?.tags ?? []}
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
                    <RefRegText>{initialValues.refReg} </RefRegText>
                    <Link href={regulatoryArea?.url}>{regulatoryArea?.url}</Link>
                    <PeriodText>
                      En vigueur depuis
                      <span> 01/01/2023</span>
                    </PeriodText>
                  </div>
                  <IconButton
                    accent={Accent.TERTIARY}
                    Icon={Icon.Edit}
                    onClick={() => setIsEditingRefRegId(regulatoryArea?.id)}
                  />
                </RefRegContainer>
              ) : (
                <EditingRefRegContainer>
                  <div>
                    <Label>Titre de la réglementation</Label>
                    <RefRegText>{initialValues.refReg} </RefRegText>
                  </div>

                  <RefRegSecondLine>
                    <FormikTextInput isLight label="URL du lien" name="url" style={{ width: '65%' }} />
                    <DateContainer>
                      <FormikDatePicker isLight isRequired label="Début de validité" name="startDate" />
                      <FormikDatePicker isLight isRequired label="Fin de validité" name="endDate" />
                    </DateContainer>
                  </RefRegSecondLine>
                  <ButtonsWrapper>
                    <Button accent={Accent.SECONDARY}>Annuler</Button>
                    <ValidateButton>Valider</ValidateButton>
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
          </Formik>
          <Footer>
            <Button accent={Accent.SECONDARY}>Annuler</Button>
            <Button>Créer la réglementation</Button>
          </Footer>
        </RegulatoryWrapper>

        <MapContainer>{childrensComponents}</MapContainer>
      </StyledBackofficeWrapper>
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

const StyledLinkButton = styled(LinkButton)`
  margin-bottom: 24px;
  > span {
    svg {
      transform: rotate(90deg);
    }
  }
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

const Footer = styled.div`
  background-color: ${p => p.theme.color.white};
  border-top: 1px solid ${p => p.theme.color.lightGray};
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-left: -40px;
  margin-right: -40px;
  padding: 16px 20px;
  position: absolute;
  width: 50%;
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
