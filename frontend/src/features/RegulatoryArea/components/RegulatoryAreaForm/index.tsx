import { useGetRegulatoryAreaByIdQuery } from '@api/regulatoryAreasAPI'
import { CancelEditDialog } from '@components/Dialog/CancelEditDialog'
import { Bold } from '@components/style'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { Title } from '@features/BackOffice/components/style'
import { MapAttributionsBox } from '@features/map/controls/MapAttributionsBox'
import { MapCoordinatesBox } from '@features/map/controls/MapCoordinatesBox'
import { MapLayer } from '@features/map/layers/MapLayer'
import { MapExtentController } from '@features/map/MapExtentController'
import { ZoomListener } from '@features/map/ZoomListener'
import { regulatoryAreaBoActions } from '@features/RegulatoryArea/slice'
import { MapContainer, RegulatoryWrapper, StyledBackofficeWrapper } from '@features/RegulatoryArea/style'
import { createOrUpdateRegulatoryArea } from '@features/RegulatoryArea/useCases/createOrUpdateRegulatoryArea'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, customDayjs, Icon, LinkButton } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { Formik } from 'formik'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import styled from 'styled-components'

import { BaseLayerSelector } from '../BaseLayerSelector'
import { FormContent } from './FormContent'
import { RegulatoryAreaFormSchema } from './Schema'
import { BackofficeRegulatoryAreaLayer } from '../Layers/BackofficeRegulatoryAreaLayer'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

const mapChildrensComponents = [
  // @ts-ignore
  <ZoomListener key="ZoomListener" />,
  <MapAttributionsBox key="MapAttributionsBox" />,
  // @ts-ignore
  <MapCoordinatesBox key="MapCoordinatesBox" />,
  // @ts-ignore
  <BackofficeRegulatoryAreaLayer key="BackofficeRegulatoryAreaLayer" />,
  // @ts-ignore
  <MapExtentController key="MapExtentController" />
]

export function RegulatoryAreaForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { regulatoryAreaId } = useParams()
  const [searchParams] = useSearchParams()
  const layerName = searchParams.get('layerName')
  const layerLocation = searchParams.get('location')

  const selectedBaseLayer = useAppSelector(state => state.regulatoryAreaBo.selectedBaseLayer)

  const [isCancelEditDialogOpen, setIsCancelEditDialogOpen] = useState(false)

  const isEditing = !!regulatoryAreaId
  const { currentData: regulatoryArea } = useGetRegulatoryAreaByIdQuery(
    regulatoryAreaId && regulatoryAreaId !== 'new' ? Number(regulatoryAreaId) : skipToken
  )

  const initialValues = useMemo(
    () =>
      ({
        additionalRefReg: regulatoryArea?.additionalRefReg ?? [],
        authorizationPeriods: regulatoryArea?.authorizationPeriods,
        creation: regulatoryArea?.creation,
        date: regulatoryArea?.date ?? customDayjs().toISOString(),
        dateFin: regulatoryArea?.dateFin,
        editeur: regulatoryArea?.editeur,
        editionBo: regulatoryArea?.editionBo,
        editionCacem: regulatoryArea?.editionCacem,
        facade: regulatoryArea?.facade,
        geom: regulatoryArea?.geom,
        id: regulatoryArea?.id,
        layerName: regulatoryArea?.layerName ?? layerName,
        location: regulatoryArea?.location ?? layerLocation,
        observations: regulatoryArea?.observations,
        plan: regulatoryArea?.plan ?? [],
        polyName: regulatoryArea?.polyName,
        prohibitionPeriods: regulatoryArea?.prohibitionPeriods,
        refReg: regulatoryArea?.refReg,
        resume: regulatoryArea?.resume,
        source: regulatoryArea?.source,
        tags: regulatoryArea?.tags ?? [],
        themes: regulatoryArea?.themes ?? [],
        type: regulatoryArea?.type,
        url: regulatoryArea?.url
      } as RegulatoryArea.RegulatoryAreaFromAPI | RegulatoryArea.NewRegulatoryArea),
    [layerName, layerLocation, regulatoryArea]
  )

  const backToList = () => {
    dispatch(regulatoryAreaBoActions.setNewRegulatoryAreaId(undefined))
    if (location.state?.from) {
      navigate(location.state?.from)
    } else {
      navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}`)
    }
  }

  const saveRegulatoryArea = async (values: RegulatoryArea.RegulatoryAreaFromAPI) => {
    const savedRegulatoryArea = await dispatch(createOrUpdateRegulatoryArea(values))
    if (savedRegulatoryArea?.id && !location.pathname.includes(`${savedRegulatoryArea.id}`)) {
      navigate(
        `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}/${savedRegulatoryArea.id}`,
        { state: { from: location.state?.from } }
      )
    }
  }

  const cancelEdition = (isDirty: boolean) => {
    if (isDirty) {
      setIsCancelEditDialogOpen(true)
    } else {
      backToList()
    }
  }

  return (
    <StyledBackofficeWrapper>
      <RegulatoryWrapper>
        <Formik
          key={regulatoryAreaId}
          enableReinitialize
          initialValues={initialValues}
          onSubmit={saveRegulatoryArea}
          validateOnChange={false}
          validationSchema={RegulatoryAreaFormSchema}
        >
          {({ dirty, handleSubmit, values }) => (
            <>
              <StyledLinkButton Icon={Icon.Chevron} onClick={() => cancelEdition(dirty)}>
                {location.state?.from &&
                (location.state.from as string).includes(BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_GROUP])
                  ? 'Revenir au groupe de la réglementations'
                  : 'Revenir à la liste des zones réglementaires'}
              </StyledLinkButton>

              <Title>Saisir une zone réglementaire</Title>
              {isCancelEditDialogOpen && (
                <CancelEditDialog
                  onCancel={() => setIsCancelEditDialogOpen(false)}
                  onConfirm={backToList}
                  text={
                    <>
                      <p>Vous êtes en train d&apos;abandonner</p>
                      <Bold>{`${isEditing ? "l'édition" : 'la création'} de la zone réglementaire.`}</Bold>
                    </>
                  }
                />
              )}
              <form onSubmit={handleSubmit}>
                <FormContent isEditing={isEditing} />

                <Footer>
                  <Button accent={Accent.SECONDARY} onClick={() => cancelEdition(dirty)}>
                    Fermer
                  </Button>
                  <Button disabled={!dirty || !values?.geom} type="submit">
                    {isEditing ? 'Enregistrer les modifications' : 'Créer la réglementation'}
                  </Button>
                </Footer>
              </form>
            </>
          )}
        </Formik>
      </RegulatoryWrapper>

      <>
        <BaseLayerSelector />
        <MapContainer>
          {[...mapChildrensComponents, <MapLayer key="MapLayer" selectedBaseLayer={selectedBaseLayer} />]}
        </MapContainer>
      </>
    </StyledBackofficeWrapper>
  )
}

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
  padding: 16px 20px;
  position: sticky;
  width: 100%;
  z-index: 6;
`
