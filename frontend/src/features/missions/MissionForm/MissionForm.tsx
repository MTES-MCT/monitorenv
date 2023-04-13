/* eslint-disable react/jsx-props-no-spreading */

import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { Formik, FieldArray } from 'formik'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton, ButtonToolbar } from 'rsuite'
import styled from 'styled-components'

import { useDeleteMissionMutation } from '../../../api/missionsAPI'
import { COLORS } from '../../../constants/constants'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setError } from '../../../domain/shared_slices/Global'
import { setMissionState } from '../../../domain/shared_slices/MissionsState'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { SyncFormValuesWithRedux } from '../../../hooks/useSyncFormValuesWithRedux'
import { FormikForm } from '../../../uiMonitor/CustomFormikFields/FormikForm'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'
import { sideWindowActions } from '../../SideWindow/slice'
import { MissionCancelEditModal } from '../MissionCancelEditModal'
import { MissionDeleteModal } from '../MissionDeleteModal'
import { ActionForm } from './ActionForm/ActionForm'
import { ActionsForm } from './ActionsForm'
import { GeneralInformationsForm } from './GeneralInformationsForm'

export function MissionForm({ formValues, id, onCreateMission, onUpdateMission }) {
  const dispatch = useDispatch()
  const { sideWindow } = useAppSelector(state => state)

  const [currentActionIndex, setCurrentActionIndex] = useState(undefined)
  const [errorOnSave, setErrorOnSave] = useState(false)
  const [errorOnDelete, setErrorOnDelete] = useState(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)

  const [deleteMission] = useDeleteMissionMutation()

  const upsertMission = id === undefined ? onCreateMission : onUpdateMission

  const handleSetCurrentActionIndex = index => {
    setCurrentActionIndex(index)
  }
  const handleSubmitForm = values => {
    upsertMission(values).then(response => {
      if ('data' in response) {
        dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
        setErrorOnSave(false)
      } else {
        dispatch(setError(response.error))
        setErrorOnSave(true)
      }
    })
  }

  const handleConfirmDelete = () => {
    setDeleteModalIsOpen(true)
  }
  const handleReturnToEdition = () => {
    dispatch(sideWindowActions.setShowConfirmCancelModal(false))
    setDeleteModalIsOpen(false)
  }
  const handleDelete = () => {
    deleteMission({ id }).then(response => {
      if ('error' in response) {
        dispatch(setError(response.error))
        setErrorOnDelete(true)
      } else {
        dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
      }
    })
  }
  const handleCancelForm = () => {
    dispatch(sideWindowActions.focusAndGoTo(sideWindow.nextPath || sideWindowPaths.MISSIONS))
  }

  return (
    <Formik enableReinitialize initialValues={formValues} onSubmit={handleSubmitForm}>
      {formikProps => {
        const handleCloseMission = () => {
          formikProps.setFieldValue('isClosed', true)
          formikProps.handleSubmit()
        }
        const handleConfirmFormCancelation = () => {
          if (formikProps.dirty) {
            dispatch(sideWindowActions.setShowConfirmCancelModal(true))
          } else {
            handleCancelForm()
          }
        }

        return (
          <FormikForm>
            <MissionCancelEditModal
              onCancel={handleReturnToEdition}
              onConfirm={handleCancelForm}
              open={sideWindow.showConfirmCancelModal}
            />
            <MissionDeleteModal onCancel={handleReturnToEdition} onConfirm={handleDelete} open={deleteModalIsOpen} />
            <SyncFormValuesWithRedux callback={setMissionState} />
            <Wrapper>
              <FirstColumn>
                <GeneralInformationsForm />
              </FirstColumn>
              <SecondColumn>
                <FieldArray
                  name="envActions"
                  render={props => (
                    <ActionsForm
                      {...props}
                      currentActionIndex={currentActionIndex}
                      setCurrentActionIndex={handleSetCurrentActionIndex}
                    />
                  )}
                />
              </SecondColumn>
              <ThirdColumn>
                <FieldArray
                  name="envActions"
                  render={({ remove }) => (
                    <ActionForm
                      currentActionIndex={currentActionIndex}
                      remove={remove}
                      setCurrentActionIndex={handleSetCurrentActionIndex}
                    />
                  )}
                />
              </ThirdColumn>
            </Wrapper>

            <Footer>
              <FormActionsWrapper>
                {
                  // id is undefined if creating a new mission
                  !id && (
                    <IconButton
                      appearance="ghost"
                      data-cy="delete-mission"
                      icon={<DeleteIcon className="rs-icon" />}
                      onClick={handleConfirmDelete}
                      type="button"
                    >
                      Supprimer la mission
                    </IconButton>
                  )
                }
                <Separator />
                <Button
                  accent={Accent.TERTIARY}
                  data-cy="quit-edit-mission"
                  onClick={handleConfirmFormCancelation}
                  type="button"
                >
                  Quitter
                </Button>

                <Button data-cy="save-mission" Icon={Icon.Save} type="submit">
                  Enregistrer et quitter
                </Button>
                <Button
                  accent={Accent.SECONDARY}
                  data-cy="close-mission"
                  Icon={Icon.Check}
                  onClick={handleCloseMission}
                >
                  Enregistrer et clôturer
                </Button>
              </FormActionsWrapper>
              {errorOnSave && <ErrorOnSave>Oups... Erreur au moment de la sauvegarde</ErrorOnSave>}
              {errorOnDelete && <ErrorOnDelete>Oups... Erreur au moment de la suppression</ErrorOnDelete>}
            </Footer>
          </FormikForm>
        )
      }}
    </Formik>
  )
}

const Wrapper = styled.div`
  height: calc(100vh - 118px);
  display: flex;
`
const FirstColumn = styled.div`
  background: ${COLORS.white};
  flex: 1;
  overflow-y: auto;
  padding: 32px;
`

const SecondColumn = styled.div`
  background: ${COLORS.cultured};
  overflow-y: auto;
  flex: 1;
`
const ThirdColumn = styled.div`
  background: ${COLORS.gainsboro};
  flex: 1;
  overflow-y: auto;
`

const ErrorOnSave = styled.div`
  background-color: ${COLORS.goldenPoppy};
  text-align: right;
`
const ErrorOnDelete = styled.div`
  background-color: ${COLORS.goldenPoppy};
`
const Separator = styled.div`
  flex: 1;
`
const DeleteIcon = styled(DeleteSVG)`
  color: ${COLORS.maximumRed};
`
const Footer = styled.div`
  border-top: 1px solid ${COLORS.lightGray};
  padding: 18px;
`
const FormActionsWrapper = styled(ButtonToolbar)`
  display: flex;
`
