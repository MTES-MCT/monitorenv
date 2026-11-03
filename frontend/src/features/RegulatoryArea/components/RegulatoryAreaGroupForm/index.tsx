import { useGetLayerNamesQuery, useGetRegulatoryAreaGroupByIdQuery } from '@api/regulatoryAreasAPI'
import { CancelEditDialog } from '@components/Dialog/CancelEditDialog'
import { Bold } from '@components/style'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { Title } from '@features/BackOffice/components/style'
import { getExtentOfLayersGroup } from '@features/layersSelector/utils/getExtentOfLayersGroup'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { MapAttributionsBox } from '@features/map/controls/MapAttributionsBox'
import { MapCoordinatesBox } from '@features/map/controls/MapCoordinatesBox'
import { MapLayer } from '@features/map/layers/MapLayer'
import { MapExtentController } from '@features/map/MapExtentController'
import { ZoomListener } from '@features/map/ZoomListener'
import { BackofficeRegulatoryAreaGroupLayer } from '@features/RegulatoryArea/components/Layers/BackofficeRegulatoryAreaGroupLayer'
import { DuplicateWarningMessage } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/DuplicateWarningMessage'
import { RegulatoryAreaGroupFormSchema } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/Schema'
import { RegulatoryAreaItem } from '@features/RegulatoryArea/components/RegulatoryAreaList/RegulatoryAreaItem'
import { regulatoryAreaTableActions } from '@features/RegulatoryArea/components/RegulatoryAreaList/slice'
import { RegulatoryAreasPanel } from '@features/RegulatoryArea/components/RegulatoryAreaPanel'
import { MapContainer, RegulatoryWrapper, StyledBackofficeWrapper, SubTitle } from '@features/RegulatoryArea/style'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import { createOrUpdateRegulatoryAreaGroup } from '@features/RegulatoryArea/useCases/createOrUpdateRegulatoryAreaGroup'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Checkbox, FormikTextInput, Icon, LinkButton, Select } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { Formik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { GroupIdentification } from './GroupIdentification'
import { RegulatoryTexts } from './RegulatoryTexts'
import { getTitle } from '../../../../domain/entities/layers/utils'
import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import { formatLayerName } from '../../utils'
import { BaseLayerSelector } from '../BaseLayerSelector'

const mapChildrensComponents = [
  // @ts-ignore
  <ZoomListener key="ZoomListener" />,
  <MapAttributionsBox key="MapAttributionsBox" />,
  // @ts-ignore
  <MapCoordinatesBox key="MapCoordinatesBox" />,
  // @ts-ignore
  <BackofficeRegulatoryAreaGroupLayer key="BackofficeRegulatoryAreaGroupLayer" />,
  // @ts-ignore
  <MapExtentController key="MapExtentController" />
]

const DATA_FROM_GROUP = [
  {
    label: 'Tracé (dont façade)',
    value: 'geom-from-group'
  },
  {
    label: 'Thématiques et sous-thématiques',
    value: 'themes-from-group'
  },
  {
    label: 'Tags et sous-tags',
    value: 'tags-from-group'
  },
  {
    label: 'Résumé',
    value: 'resume-from-group'
  },
  {
    label: "Période d'autorisation",
    value: 'periode-autorisation-from-group'
  },
  {
    label: "Période d'interdiction",
    value: 'periode-interdiction-from-group'
  }
]

export function RegulatoryAreaGroupForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { groupId } = useParams()

  const openedRegulatoryAreaId = useAppSelector(state => state.regulatoryAreaTable.openedRegulatoryAreaId)

  const isNew = groupId === 'new'
  const { data: regulatoryAreaGroup } = useGetRegulatoryAreaGroupByIdQuery(
    groupId && !Number.isNaN(+groupId) ? +groupId : skipToken
  )
  const { data: layerNames } = useGetLayerNamesQuery()

  const layerNameOptions = useMemo(() => {
    const formattedLayerNames = (layerNames ?? [])
      ?.filter(regulatoryArea => regulatoryArea.group.layerName && regulatoryArea.group.layerName.trim() !== '')
      .map(regulatoryArea => {
        const formattedLayerName = formatLayerName(regulatoryArea.group.layerName, regulatoryArea.group.location)

        return {
          label: getTitle(formattedLayerName),
          value: formattedLayerName
        }
      })

    return formattedLayerNames.sort((a, b) => a.label.localeCompare(b.label))
  }, [layerNames])

  const selectedBaseLayer = useAppSelector(state => state.regulatoryAreaBo.selectedBaseLayer)

  const [isCancelEditDialogOpen, setIsCancelEditDialogOpen] = useState(false)
  const [selectedValuesToCopy, setSelectedValuesToCopy] = useState<string[]>([])

  const initialValues: RegulatoryArea.RegulatoryAreaGroupToApi = {
    additionalRefReg: regulatoryAreaGroup?.group.additionalRefReg,
    authorizationPeriods: regulatoryAreaGroup?.group.authorizationPeriods,
    date: regulatoryAreaGroup?.group.date,
    dateFin: regulatoryAreaGroup?.group.dateFin,
    id: regulatoryAreaGroup?.group.id,
    layerName: regulatoryAreaGroup?.group.layerName,
    location: regulatoryAreaGroup?.group.location,
    prohibitionPeriods: regulatoryAreaGroup?.group.prohibitionPeriods,
    refReg: regulatoryAreaGroup?.group.refReg,
    regulatoryAreaIds: regulatoryAreaGroup?.regulatoryAreas.map(({ id }) => id) ?? [],
    tags: regulatoryAreaGroup?.group.tags,
    themes: regulatoryAreaGroup?.group.themes,
    type: regulatoryAreaGroup?.group.type,
    url: regulatoryAreaGroup?.group.url
  }

  const backToList = () => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}`)
  }

  const [navigateCallback, setNavigateCallback] = useState(() => backToList)

  const saveRegulatoryAreaGroup = async (group: RegulatoryArea.RegulatoryAreaGroupToApi) => {
    const savedRegulatoryAreaGroup = await dispatch(createOrUpdateRegulatoryAreaGroup(group))
    if (savedRegulatoryAreaGroup?.group.id && !location.pathname.includes(`${savedRegulatoryAreaGroup.group.id}`)) {
      navigate(
        `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_GROUP]}/${savedRegulatoryAreaGroup.group.id}`,
        {
          state: { from: location.state?.from }
        }
      )
    }
  }

  const cancelEdition = (isDirty: boolean) => {
    if (isDirty) {
      setIsCancelEditDialogOpen(true)
      setNavigateCallback(() => backToList)
    } else {
      closePanel()
      backToList()
    }
  }

  const closePanel = () => {
    dispatch(regulatoryAreaTableActions.setOpenRegulatoryAreaId(undefined))
  }

  const createRegulatoryArea = (isDirty: boolean) => {
    if (isDirty) {
      setIsCancelEditDialogOpen(true)
      setNavigateCallback(
        () => () =>
          navigate(
            `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}/new?groupId=${regulatoryAreaGroup?.group.id}`,
            {
              state: { from: location.pathname }
            }
          )
      )
    } else {
      navigate(
        `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}/new?groupId=${regulatoryAreaGroup?.group.id}`,
        {
          state: { from: location.pathname }
        }
      )
    }
  }

  const selectValuesToCopy = (value: string) => {
    setSelectedValuesToCopy(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]))
  }

  useEffect(() => {
    if (!regulatoryAreaGroup?.regulatoryAreas) {
      return
    }

    const extent = getExtentOfLayersGroup(regulatoryAreaGroup.regulatoryAreas)
    dispatch(setFitToExtent(extent))
  }, [dispatch, regulatoryAreaGroup?.regulatoryAreas])

  return (
    <StyledBackofficeWrapper>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={saveRegulatoryAreaGroup}
        validateOnChange={false}
        validationSchema={RegulatoryAreaGroupFormSchema}
      >
        {({ dirty, handleSubmit, values }) => (
          <RegulatoryWrapper>
            <header>
              <StyledLinkButton Icon={Icon.Chevron} onClick={() => cancelEdition(dirty)}>
                Revenir à la liste des zones réglementaires
              </StyledLinkButton>
              <Title>{isNew ? 'Créer un nouveau' : 'Modifier un'} groupe de réglementations</Title>
              {isCancelEditDialogOpen && (
                <CancelEditDialog
                  onCancel={() => setIsCancelEditDialogOpen(false)}
                  onConfirm={navigateCallback}
                  text={
                    <>
                      <p>Vous êtes en train d&apos;abandonner</p>
                      <Bold>{isNew ? 'la création' : "l'édition"} du groupe de réglementations.</Bold>
                    </>
                  }
                />
              )}
            </header>
            <StyledForm onSubmit={handleSubmit}>
              <FormContent>
                <section>
                  <SubTitleWrapper>
                    <StyledSubTitle>NOM DU GROUPE DE RÉGLEMENTATIONS</StyledSubTitle>
                    <OutlinedSelect
                      isLabelHidden
                      isLight
                      label="Consulter la liste des groupes existants"
                      name="name"
                      onChange={() => {}}
                      options={layerNameOptions}
                      placeholder="Consulter la liste des groupes existants"
                      searchable
                      value={undefined}
                    />
                  </SubTitleWrapper>
                  <Fields>
                    <FormikTextInput isErrorMessageHidden isRequired label="Type" name="layerName" />
                    <FormikTextInput isErrorMessageHidden isRequired label="Lieu" name="location" />
                  </Fields>
                  <DuplicateWarningMessage id={values.id} layerName={values.layerName} location={values.location} />
                </section>
                <section>
                  <SubTitleWrapper>
                    <StyledSubTitle>RÉGLEMENTATIONS APPARTEMENT AU GROUPE</StyledSubTitle>
                    <Button disabled={isNew} Icon={Icon.Plus} onClick={() => createRegulatoryArea(dirty)}>
                      Ajouter une réglementation
                    </Button>
                  </SubTitleWrapper>
                  {regulatoryAreaGroup?.regulatoryAreas?.length ? (
                    <GroupList $isOpen $length={regulatoryAreaGroup?.regulatoryAreas?.length ?? 0}>
                      {regulatoryAreaGroup?.regulatoryAreas.map(area => (
                        <RegulatoryAreaItem key={area.id} groupId={values.id} regulatoryArea={area} />
                      ))}
                    </GroupList>
                  ) : (
                    <NoRegulatoryAreas>Aucune réglementation appartenant au groupe</NoRegulatoryAreas>
                  )}
                </section>
                <section>
                  <SubTitleWrapper>
                    <StyledSubTitle>IMPACT DU GROUPE SUR LES RÉGLEMENTATIONS PRÉSENTES DEDANS</StyledSubTitle>
                  </SubTitleWrapper>
                  <CommonPropertiesWrapper>
                    <Information>
                      Associer <Bold>par défaut</Bold> des éléments à{' '}
                      <Bold>toutes les réglementations présentes dans le groupe</Bold>
                    </Information>
                    <ReadOnlyCheckbox
                      checked
                      label="Textes réglementaires (dont type d’acte administratif)"
                      name="regulatoryText"
                      onChange={() => {}}
                      readOnly
                    />
                    {DATA_FROM_GROUP.map(item => (
                      <Checkbox
                        key={item.value}
                        checked={selectedValuesToCopy.includes(item.value)}
                        label={item.label}
                        name={item.value}
                        onChange={() => selectValuesToCopy(item.value)}
                      />
                    ))}
                  </CommonPropertiesWrapper>
                </section>
                <GroupIdentification />

                <RegulatoryTexts isNew={isNew} />
              </FormContent>

              <Footer>
                <Button accent={Accent.SECONDARY} onClick={() => cancelEdition(dirty)}>
                  Fermer
                </Button>
                <Button disabled={!dirty} type="submit">
                  {isNew ? 'Créer le groupe' : 'Enregistrer les modifications'}
                </Button>
              </Footer>
            </StyledForm>
          </RegulatoryWrapper>
        )}
      </Formik>
      <>
        <BaseLayerSelector />
        <MapContainer>
          {[...mapChildrensComponents, <MapLayer key="MapLayer" selectedBaseLayer={selectedBaseLayer} />]}
        </MapContainer>
      </>
      {openedRegulatoryAreaId && <StyledRegulatoryAreasPanel layerId={openedRegulatoryAreaId} onClose={closePanel} />}
    </StyledBackofficeWrapper>
  )
}

const StyledRegulatoryAreasPanel = styled(RegulatoryAreasPanel)`
  left: 51%;
  top: 12px;
`

const StyledLinkButton = styled(LinkButton)`
  margin-bottom: 24px;

  > span {
    svg {
      transform: rotate(90deg);
    }
  }
`

const Footer = styled.footer`
  background-color: ${p => p.theme.color.white};
  border-top: 1px solid ${p => p.theme.color.lightGray};
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 0;
  position: sticky;
  width: 100%;
  z-index: 6;
`
const StyledSubTitle = styled(SubTitle)`
  border: none;
  margin: 0;
`

export const SubTitleWrapper = styled.div`
  align-items: center;
  border-bottom: ${p => `1px solid ${p.theme.color.lightGray}`};
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`
const Fields = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr;
`

const CommonPropertiesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const FormContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 24px;
`

const GroupList = styled(LayerSelector.GroupList)`
  border-bottom: none;

  > li {
    padding: 8px 16px;
  }
`

const OutlinedSelect = styled(Select)`
  border: 1px solid ${p => p.theme.color.lightGray};

  .rs-picker-select-menu-item:hover {
    background-color: ${p => p.theme.color.white} !important;
    color: ${p => p.theme.color.charcoal} !important;
    cursor: default;
  }
`

const Information = styled.p`
  color: ${p => p.theme.color.slateGray};
`

const NoRegulatoryAreas = styled(Information)`
  font-style: italic;
`
const ReadOnlyCheckbox = styled(Checkbox)`
  label:hover {
    color: ${p => p.theme.color.gunMetal} !important;
  }
`
