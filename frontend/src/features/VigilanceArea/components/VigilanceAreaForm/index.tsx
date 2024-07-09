import { useGetVigilanceAreaQuery } from '@api/vigilanceAreasAPI'
import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, Size, Tag, THEME } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { Formik } from 'formik'
import { noop } from 'lodash'
import { useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { SelectRegulatoryAreas } from './AddRegulatoryAreas/SelectRegulatoryAreas'
import { DrawVigilanceArea } from './DrawVigilanceArea'
import { Form } from './Form'
import { VigilanceAreaSchema } from './Schema'
import { getVigilanceAreaInitialValues } from './utils'
import { VigilanceAreaPanel } from './VigilanceAreaPanel'
import { getVigilanceAreaColorWithAlpha } from '../VigilanceAreaLayer/style'

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

  const isNewVigilanceArea = !!(vigilanceAreaId === -1)

  const { data: vigilanceArea } = useGetVigilanceAreaQuery(!isNewVigilanceArea ? vigilanceAreaId : skipToken)

  const initialValues =
    vigilanceArea && vigilanceAreaId === vigilanceArea.id ? vigilanceArea : getVigilanceAreaInitialValues()

  const squareColor = useMemo(
    () => getVigilanceAreaColorWithAlpha(initialValues?.name, initialValues?.comments),
    [initialValues]
  )

  const title = !isNewVigilanceArea ? vigilanceArea?.name : "Création d'une zone de vigilance"

  const close = () => {
    dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
  }

  useEffect(() => {
    if (editingVigilanceAreaId && vigilanceArea && vigilanceArea.id === editingVigilanceAreaId) {
      dispatch(vigilanceAreaActions.addRegulatoryAreasToVigilanceArea(vigilanceArea?.linkedRegulatoryAreas ?? []))
      dispatch(vigilanceAreaActions.setGeometry(vigilanceArea?.geom))
    }
    // we just want to listen when editingVigilanceAreaId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingVigilanceAreaId])

  return (
    <Wrapper $isMainFormOpen={isFormOpen && formTypeOpen === VigilanceAreaFormTypeOpen.FORM} $isOpen={isOpen}>
      <Header $isEditing={!!vigilanceAreaId}>
        <TitleContainer>
          <Square $color={squareColor} />
          <Title data-cy="vigilance-area-title" title={title}>
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
            <IconButton accent={Accent.TERTIARY} Icon={Icon.Close} onClick={close} size={Size.SMALL} />
          </SubHeaderContainer>
        )}
      </Header>

      <Formik enableReinitialize initialValues={initialValues} onSubmit={noop} validationSchema={VigilanceAreaSchema}>
        <>
          {isPanelOpen && <VigilanceAreaPanel vigilanceArea={vigilanceArea} />}
          {isFormOpen && (
            <>
              {formTypeOpen === VigilanceAreaFormTypeOpen.FORM && <Form />}
              {formTypeOpen === VigilanceAreaFormTypeOpen.DRAW && <DrawVigilanceArea />}
              {formTypeOpen === VigilanceAreaFormTypeOpen.ADD_REGULATORY && <SelectRegulatoryAreas />}
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
const Title = styled.span`
  font-size: 15px;
  color: ${p => p.theme.color.gunMetal};
`
const Square = styled.div<{ $color: string }>`
  width: 18px;
  height: 18px;
  background: ${p => p.$color};
  border: 1px solid ${p => p.theme.color.slateGray};
  display: inline-block;
  margin-right: 10px;
  flex-shrink: 0;
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
