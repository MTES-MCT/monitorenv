import { useGetRegulatoryAreaByIdQuery } from '@api/regulatoryAreasAPI'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { Title } from '@features/BackOffice/components/style'
import { CancelEditDialog } from '@features/commonComponents/Modals/CancelEditModal'
import { MapAttributionsBox } from '@features/map/controls/MapAttributionsBox'
import { MapCoordinatesBox } from '@features/map/controls/MapCoordinatesBox'
import { MapLayer } from '@features/map/layers/MapLayer'
import { MapExtentController } from '@features/map/MapExtentController'
import { ZoomListener } from '@features/map/ZoomListener'
import { MapContainer, RegulatoryWrapper, StyledBackofficeWrapper } from '@features/RegulatoryArea/style'
import { createOrUpdateRegulatoryArea } from '@features/RegulatoryArea/useCases/createOrUpdateRegulatoryArea'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, customDayjs, Icon, LinkButton } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { Formik } from 'formik'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { FormContent } from './FormContent'
import { RegulatoryAreaFormSchema } from './Schema'
import { BackofficeRegulatoryAreaLayer } from '../Layers/BackofficeRegulatoryAreaLayer'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

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

export function RegulatoryAreaForm() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { regulatoryAreaId } = useParams()

  const [isCancelEditDialogOpen, setIsCancelEditDialogOpen] = useState(false)

  const isEditing = !!regulatoryAreaId
  const { currentData: regulatoryArea } = useGetRegulatoryAreaByIdQuery(
    regulatoryAreaId && regulatoryAreaId !== 'new' ? Number(regulatoryAreaId) : skipToken
  )

  const initialValues = useMemo(
    () => ({
      creation: regulatoryArea?.creation,
      date: regulatoryArea?.date,
      dateFin: regulatoryArea?.dateFin,
      dureeValidite: regulatoryArea?.dureeValidite,
      editeur: regulatoryArea?.editeur,
      editionBo: regulatoryArea?.editionBo,
      editionCacem: regulatoryArea?.editionCacem,
      facade: regulatoryArea?.facade,
      geom: regulatoryArea?.geom,
      id: regulatoryArea?.id,
      layerName: regulatoryArea?.layerName,
      observations: regulatoryArea?.observations,
      plan: regulatoryArea?.plan,
      polyName: regulatoryArea?.polyName,
      refReg: regulatoryArea?.refReg,
      resume: regulatoryArea?.resume,
      source: regulatoryArea?.source,
      tags: regulatoryArea?.tags ?? [],
      temporalite: regulatoryArea?.temporalite,
      themes: regulatoryArea?.themes ?? [],
      type: regulatoryArea?.type,
      url: regulatoryArea?.url
    }),
    [regulatoryArea]
  )

  const onBackToList = () => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}`)
  }

  const saveRegulatoryArea = (values: RegulatoryArea.RegulatoryAreaFromAPI) => {
    const currentDate = values.creation ? values.creation : customDayjs().toISOString()
    const regulatoryAreaToSave = { ...values, creation: currentDate, editionBo: currentDate }
    dispatch(createOrUpdateRegulatoryArea(regulatoryAreaToSave, navigate))
  }

  const cancelEdition = (isDirty: boolean) => {
    if (isDirty) {
      setIsCancelEditDialogOpen(true)
    } else {
      navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}`)
    }
  }

  return (
    <>
      <StyledBackofficeWrapper>
        <RegulatoryWrapper>
          <StyledLinkButton Icon={Icon.Chevron} onClick={onBackToList}>
            Revenir à la liste des zones réglementaires
          </StyledLinkButton>

          <Title>Saisir une zone réglementaire</Title>
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
                {isCancelEditDialogOpen && (
                  <CancelEditDialog
                    onCancel={() => setIsCancelEditDialogOpen(false)}
                    onConfirm={() =>
                      navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}`)
                    }
                    open={isCancelEditDialogOpen}
                    subText="Voulez-vous enregistrer les modifications avant de quitter ?"
                    text={`Vous êtes en train d'abandonner l'édition de la zone réglementaire`}
                    title="Enregistrer les modifications"
                  />
                )}
                <form onSubmit={handleSubmit}>
                  <FormContent isEditing={isEditing} />

                  <Footer>
                    <Button accent={Accent.SECONDARY} onClick={() => cancelEdition(dirty)}>
                      Annuler
                    </Button>
                    <Button disabled={!dirty || !values?.geom} type="submit">
                      Créer la réglementation
                    </Button>
                  </Footer>
                </form>
              </>
            )}
          </Formik>
        </RegulatoryWrapper>

        <MapContainer>{childrensComponents}</MapContainer>
      </StyledBackofficeWrapper>
    </>
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
  margin-left: -40px;
  margin-right: -40px;
  padding: 16px 20px;
  position: absolute;
  width: 50%;
`
