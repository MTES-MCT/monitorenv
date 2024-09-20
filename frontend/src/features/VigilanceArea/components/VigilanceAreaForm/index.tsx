import { useGetVigilanceAreaQuery } from '@api/vigilanceAreasAPI'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { NEW_VIGILANCE_AREA_ID } from '@features/VigilanceArea/constants'
import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { displayOrHideOtherLayers } from '@features/VigilanceArea/useCases/displayOrHideOtherLayers'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, Size, Tag, THEME } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { Formik } from 'formik'
import { noop } from 'lodash'
import { useEffect } from 'react'
import styled from 'styled-components'

import { SelectAMP } from './AddAMPs/SelectAMPs'
import { SelectRegulatoryAreas } from './AddRegulatoryAreas/SelectRegulatoryAreas'
import { DrawVigilanceArea } from './DrawVigilanceArea'
import { Form } from './Form'
import { VigilanceAreaSchema } from './Schema'
import { getVigilanceAreaInitialValues } from './utils'
import { VigilanceAreaPanel } from './VigilanceAreaPanel'

type VigilanceAreaFormProps = {
  isOpen: boolean
  isReadOnly?: boolean
  vigilanceAreaId: number
}
export function VigilanceAreaForm({ isOpen, isReadOnly = false, vigilanceAreaId }: VigilanceAreaFormProps) {
  const dispatch = useAppDispatch()

  const formTypeOpen = useAppSelector(state => state.vigilanceArea.formTypeOpen)
  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)

  const isPanelOpen = !!(selectedVigilanceAreaId && !editingVigilanceAreaId) || isReadOnly
  const isFormOpen = !!(selectedVigilanceAreaId && editingVigilanceAreaId) && !isReadOnly

  const isNewVigilanceArea = !!(vigilanceAreaId === NEW_VIGILANCE_AREA_ID)

  const { data: vigilanceArea } = useGetVigilanceAreaQuery(!isNewVigilanceArea ? vigilanceAreaId : skipToken)

  const initialValues =
    vigilanceArea && vigilanceAreaId === vigilanceArea.id ? vigilanceArea : getVigilanceAreaInitialValues()

  const title = !isNewVigilanceArea ? vigilanceArea?.name : "Création d'une zone de vigilance"

  const close = () => {
    if (!editingVigilanceAreaId) {
      dispatch(vigilanceAreaActions.resetState())
    }
    dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
  }

  const onCancelSubForm = () => {
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.FORM))
    dispatch(displayOrHideOtherLayers({ display: true }))
  }

  useEffect(() => {
    if (editingVigilanceAreaId && vigilanceArea && vigilanceArea.id === editingVigilanceAreaId) {
      dispatch(
        vigilanceAreaActions.updateEditingVigilanceArea({
          ampToAdd: vigilanceArea.linkedAMPs,
          geometry: vigilanceArea.geom,
          regulatoryAreasToAdd: vigilanceArea.linkedRegulatoryAreas
        })
      )
    }
    if (editingVigilanceAreaId === NEW_VIGILANCE_AREA_ID) {
      dispatch(
        vigilanceAreaActions.updateEditingVigilanceArea({
          ampToAdd: [],
          geometry: undefined,
          regulatoryAreasToAdd: []
        })
      )
    }
    // we just want to listen when editingVigilanceAreaId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingVigilanceAreaId])

  return (
    <Wrapper $isMainFormOpen={isFormOpen && formTypeOpen === VigilanceAreaFormTypeOpen.FORM} $isOpen={isOpen}>
      <Header $isEditing={!!vigilanceAreaId}>
        <TitleContainer>
          <LayerLegend
            isArchived={vigilanceArea?.isArchived}
            layerType={MonitorEnvLayers.VIGILANCE_AREA}
            legendKey={vigilanceArea?.comments ?? 'aucun nom'}
            size={Size.NORMAL}
            type={vigilanceArea?.name ?? 'aucun nom'}
          />
          <Title
            $isDraft={vigilanceArea?.isDraft ?? true}
            $isNew={isNewVigilanceArea}
            data-cy="vigilance-area-title"
            title={title}
          >
            {title}
          </Title>
        </TitleContainer>
        {isPanelOpen && (
          <SubHeaderContainer>
            {vigilanceArea?.isDraft && (
              <Tag backgroundColor={THEME.color.slateGray} color={THEME.color.white}>
                Brouillon
              </Tag>
            )}
            <IconButton
              accent={Accent.TERTIARY}
              Icon={Icon.Close}
              onClick={close}
              size={Size.SMALL}
              title="Fermer la zone de vigilance"
            />
          </SubHeaderContainer>
        )}
      </Header>

      <Formik enableReinitialize initialValues={initialValues} onSubmit={noop} validationSchema={VigilanceAreaSchema}>
        <>
          {isPanelOpen && <VigilanceAreaPanel vigilanceArea={vigilanceArea} />}
          {isFormOpen && (
            <>
              {formTypeOpen === VigilanceAreaFormTypeOpen.FORM && <Form />}
              {formTypeOpen === VigilanceAreaFormTypeOpen.DRAW && <DrawVigilanceArea onCancel={onCancelSubForm} />}
              {formTypeOpen === VigilanceAreaFormTypeOpen.ADD_REGULATORY && (
                <SelectRegulatoryAreas onCancel={onCancelSubForm} />
              )}
              {formTypeOpen === VigilanceAreaFormTypeOpen.ADD_AMP && <SelectAMP onCancel={onCancelSubForm} />}
            </>
          )}
        </>
      </Formik>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $isMainFormOpen: boolean; $isOpen: boolean }>`
  border-radius: 2px;
  width: 416px;
  display: block;
  color: ${p => p.theme.color.charcoal};
  opacity: ${p => (p.$isOpen ? 1 : 0)};
  padding: 0;
  transition: all 0.5s;
  height: ${p => (p.$isMainFormOpen ? 'calc(100vh - 65px)' : 'auto')};
`

const Header = styled.header<{ $isEditing: boolean }>`
  align-items: center;
  background-color: ${p => (p.$isEditing ? p.theme.color.gainsboro : p.theme.color.blueGray25)};
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding: 9px 16px 10px 16px;
`
const Title = styled.span<{ $isDraft: boolean; $isNew: boolean }>`
  font-size: 15px;
  color: ${p => p.theme.color.gunMetal};
  overflow: hidden;
  margin-left: 8px;
  max-width: ${p => {
    if (p.$isNew) {
      return '100%'
    }

    return p.$isDraft ? '230px' : '318px'
  }};
  text-overflow: ellipsis;
  white-space: nowrap;
`
const SubHeaderContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 16px;
`
const TitleContainer = styled.div`
  align-items: center;
  display: flex;
`
