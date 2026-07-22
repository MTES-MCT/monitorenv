import { useGetLayerNamesQuery, useGetRegulatoryAreaGroupByIdQuery } from '@api/regulatoryAreasAPI'
import { CancelEditDialog } from '@components/Dialog/CancelEditDialog'
import { Bold } from '@components/style'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { Title } from '@features/BackOffice/components/style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { MapAttributionsBox } from '@features/map/controls/MapAttributionsBox'
import { MapCoordinatesBox } from '@features/map/controls/MapCoordinatesBox'
import { MapLayer } from '@features/map/layers/MapLayer'
import { MapExtentController } from '@features/map/MapExtentController'
import { ZoomListener } from '@features/map/ZoomListener'
import { BackofficeRegulatoryAreaGroupLayer } from '@features/RegulatoryArea/components/Layers/BackofficeRegulatoryAreaGroupLayer'
import { SubTitle } from '@features/RegulatoryArea/components/RegulatoryAreaForm/style'
import { RegulatoryAreaGroupFormSchema } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/Schema'
import { RegulatoryAreaItem } from '@features/RegulatoryArea/components/RegulatoryAreaList/RegulatoryAreaItem'
import { regulatoryAreaTableActions } from '@features/RegulatoryArea/components/RegulatoryAreaList/slice'
import { RegulatoryAreasPanel } from '@features/RegulatoryArea/components/RegulatoryAreaPanel'
import { MapContainer, RegulatoryWrapper, StyledBackofficeWrapper } from '@features/RegulatoryArea/style'
import { createOrUpdateRegulatoryAreaGroup } from '@features/RegulatoryArea/useCases/createOrUpdateRegulatoryAreaGroup'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  Accent,
  Button,
  FormikTextInput,
  Icon,
  LinkButton,
  OPENLAYERS_PROJECTION,
  Select,
  WSG84_PROJECTION
} from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { Formik } from 'formik'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { getTitle } from '../../../../domain/entities/layers/utils'
import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import { BaseLayerSelector } from '../BaseLayerSelector'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

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

export function RegulatoryAreaGroupForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const openedRegulatoryAreaId = useAppSelector(state => state.regulatoryAreaTable.openedRegulatoryAreaId)
  const { groupId } = useParams()
  const { data: regulatoryAreaGroup } = useGetRegulatoryAreaGroupByIdQuery(
    groupId && !Number.isNaN(+groupId) ? +groupId : skipToken
  )
  const { data: layerNames } = useGetLayerNamesQuery()

  const layerNameOptions = useMemo(() => {
    const formattedLayerNames = Object.keys(layerNames?.layerNames || {})
      .filter(layerName => layerName && layerName.trim() !== '')
      .map(layerName => ({
        label: getTitle(layerName),
        value: layerName
      }))

    return formattedLayerNames.sort((a, b) => a.label.localeCompare(b.label))
  }, [layerNames])

  const selectedBaseLayer = useAppSelector(state => state.regulatoryAreaBo.selectedBaseLayer)

  const [isCancelEditDialogOpen, setIsCancelEditDialogOpen] = useState(false)

  const [layerName, layerLocation] = regulatoryAreaGroup?.group.layerName.split(' - ') ?? []

  const initialValues: RegulatoryArea.RegulatoryAreaGroupToApi = {
    id: regulatoryAreaGroup?.group.id,
    location: layerLocation,
    regulatoryAreaIds: regulatoryAreaGroup?.regulatoryAreas.map(({ id }) => id) ?? [],
    type: getTitle(layerName)
  }

  const backToList = () => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}`)
  }

  const saveRegulatoryAreaGroup = (group: RegulatoryArea.RegulatoryAreaGroupToApi) => {
    dispatch(createOrUpdateRegulatoryAreaGroup(group))
  }

  const cancelEdition = (isDirty: boolean) => {
    if (isDirty) {
      setIsCancelEditDialogOpen(true)
    } else {
      closePanel()
      backToList()
    }
  }

  const closePanel = () => {
    dispatch(regulatoryAreaTableActions.setOpenRegulatoryAreaId(undefined))
  }

  const createRegulatoryArea = (type: string) => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}/new?layerName=${type}`, {
      state: { from: location.pathname }
    })
  }

  useEffect(() => {
    if (!regulatoryAreaGroup?.group.bbox) {
      return
    }

    const extent = transformExtent(
      regulatoryAreaGroup?.group.bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    dispatch(setFitToExtent(extent))
  }, [dispatch, regulatoryAreaGroup?.group.bbox])

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
            <StyledLinkButton Icon={Icon.Chevron} onClick={() => cancelEdition(dirty)}>
              Revenir à la liste des zones réglementaires
            </StyledLinkButton>
            <Title>Modifier un groupe de réglementations</Title>
            {isCancelEditDialogOpen && (
              <CancelEditDialog
                onCancel={() => setIsCancelEditDialogOpen(false)}
                onConfirm={backToList}
                text={
                  <>
                    <p>Vous êtes en train d&apos;abandonner</p>
                    <Bold>l&apos;édition du groupe de réglementation.</Bold>
                  </>
                }
              />
            )}
            <StyledForm onSubmit={handleSubmit}>
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
                <FormikTextInput isErrorMessageHidden label="Type" name="type" />
                <FormikTextInput isErrorMessageHidden label="Lieu" name="location" />
              </Fields>
              <SubTitleWrapper>
                <StyledSubTitle>RÉGLEMENTATIONS APPARTEMENT AU GROUPE</StyledSubTitle>
                <Button Icon={Icon.Plus} onClick={() => createRegulatoryArea(values.type ?? '')}>
                  Saisir une nouvelle réglementation
                </Button>
              </SubTitleWrapper>
              <GroupList $isOpen $length={regulatoryAreaGroup?.regulatoryAreas?.length ?? 0}>
                {regulatoryAreaGroup?.regulatoryAreas.map(area => (
                  <RegulatoryAreaItem key={area.id} regulatoryArea={area} />
                ))}
              </GroupList>

              <Footer>
                <Button accent={Accent.SECONDARY} onClick={() => cancelEdition(dirty)}>
                  Fermer
                </Button>
                <Button disabled={!dirty} type="submit">
                  Enregistrer les modifications
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
const StyledSubTitle = styled(SubTitle)`
  border: none;
  margin: 0;
`

const SubTitleWrapper = styled.div`
  align-items: center;
  border-bottom: ${p => `1px solid ${p.theme.color.lightGray}`};
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
`
const Fields = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr;
  padding-top: 16px;
`

const StyledForm = styled.form`
  display: flex;
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
`
