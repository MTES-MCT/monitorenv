/* eslint-disable react/jsx-props-no-spreading */
import { FormikDatePicker } from '@mtes-mct/monitor-ui'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FieldArray, useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'
import { Form, IconButton } from 'rsuite'
import styled from 'styled-components'

import { useGetControlThemesQuery } from '../../../../../api/controlThemesAPI'
import { COLORS } from '../../../../../constants/constants'
import {
  MissionType,
  EnvActionControlType,
  THEME_REQUIRE_PROTECTED_SPECIES,
  actionTargetTypeEnum,
  vehicleTypeEnum
} from '../../../../../domain/entities/missions'
import { usePrevious } from '../../../../../hooks/usePrevious'
import { useNewWindow } from '../../../../../ui/NewWindow'
import { FormikInputNumberGhost } from '../../../../../uiMonitor/CustomFormikFields/FormikInputNumber'
import { ReactComponent as ControlIconSVG } from '../../../../../uiMonitor/icons/Control.svg'
import { ReactComponent as DeleteSVG } from '../../../../../uiMonitor/icons/Delete.svg'
import { MultiPointPicker } from '../../../MultiPointPicker'
import { ProtectedSpeciesSelector } from '../ProtectedSpeciesSelector'
import { ThemeSelector } from '../ThemeSelector'
import { ActionTargetSelector } from './ActionTargetSelector'
import { InfractionsForm } from './InfractionsForm'
import { VehicleTypeSelector } from './VehicleTypeSelector'

export function ControlForm({
  currentActionIndex,
  remove,
  setCurrentActionIndex
}: {
  currentActionIndex: number
  remove: Function
  setCurrentActionIndex: Function
}) {
  const { newWindowContainerRef } = useNewWindow()

  const {
    setFieldValue,
    setValues,
    values: { envActions }
  } = useFormikContext<MissionType<EnvActionControlType>>()
  const currentAction = envActions[currentActionIndex]

  const parsedActionStartDateTimeUtc =
    currentAction?.actionStartDateTimeUtc && new Date(currentAction.actionStartDateTimeUtc)
  const { actionNumberOfControls, actionTargetType, actionTheme, protectedSpecies, vehicleType } = currentAction || {}
  const { data, isError, isLoading } = useGetControlThemesQuery()
  const themes = useMemo(() => _.uniqBy(data, 'themeLevel1'), [data])
  const subThemes = useMemo(() => _.filter(data, t => t.themeLevel1 === actionTheme), [data, actionTheme])

  const previousActionTheme = usePrevious(actionTheme)
  const previousActionIndex = usePrevious(currentActionIndex)

  useEffect(() => {
    if (previousActionIndex === currentActionIndex && previousActionTheme && previousActionTheme !== actionTheme) {
      setFieldValue(`envActions.${currentActionIndex}.actionSubTheme`, '')
    }
    if (
      previousActionIndex === currentActionIndex &&
      !!protectedSpecies &&
      protectedSpecies.length > 0 &&
      !!actionTheme &&
      !THEME_REQUIRE_PROTECTED_SPECIES.includes(actionTheme)
    ) {
      setFieldValue(`envActions.${currentActionIndex}.protectedSpecies`, [])
    }
  }, [previousActionTheme, actionTheme, protectedSpecies, previousActionIndex, currentActionIndex, setFieldValue])

  const onVehicleTypeChange = selectedVehicleType => {
    setValues(v => {
      const w = _.cloneDeep(v)
      _.set(w, `envActions[${currentActionIndex}].vehicleType`, selectedVehicleType)
      if (selectedVehicleType !== vehicleTypeEnum.VESSEL.code) {
        _.update(w, `envActions[${currentActionIndex}].infractions`, inf =>
          inf?.map(i => ({ ...i, vesselSize: null, vesselType: null }))
        )
      }

      return w
    })
  }
  const onTargetTypeChange = selectedTargetType => {
    setValues(v => {
      const w = _.cloneDeep(v)
      _.set(w, `envActions[${currentActionIndex}].actionTargetType`, selectedTargetType)

      if (selectedTargetType !== actionTargetTypeEnum.VEHICLE.code) {
        _.set(w, `envActions[${currentActionIndex}].vehicleType`, null)
        _.update(w, `envActions[${currentActionIndex}].infractions`, inf =>
          inf?.map(i => ({ ...i, vesselSize: null, vesselType: null }))
        )
      }
      if (selectedTargetType === actionTargetTypeEnum.VEHICLE.code && vehicleType === null) {
        _.set(w, `envActions[${currentActionIndex}].vehicleType`, vehicleTypeEnum.VESSEL.code)
      }

      return w
    })
  }

  const handleRemoveAction = () => {
    setCurrentActionIndex(null)
    remove(currentActionIndex)
  }

  const canAddInfraction =
    actionNumberOfControls &&
    actionNumberOfControls > 0 &&
    ((actionTargetType === actionTargetTypeEnum.VEHICLE.code && vehicleType !== undefined) ||
      (actionTargetType !== undefined && actionTargetType !== actionTargetTypeEnum.VEHICLE.code)) &&
    actionNumberOfControls > (envActions[currentActionIndex]?.infractions?.length || 0)

  return (
    <>
      <Header>
        <ControlIcon />
        <Title>Contrôle{actionNumberOfControls && actionNumberOfControls > 1 ? 's' : ''}</Title>
        <SubTitle>
          &nbsp;(
          {parsedActionStartDateTimeUtc &&
            isValid(parsedActionStartDateTimeUtc) &&
            format(parsedActionStartDateTimeUtc, 'dd MMM à HH:mm', { locale: fr })}
          )
        </SubTitle>
        <IconButtonRight
          appearance="ghost"
          icon={<DeleteIcon className="rs-icon" />}
          onClick={handleRemoveAction}
          size="sm"
          title="supprimer"
        >
          Supprimer
        </IconButtonRight>
      </Header>
      <FormBody>
        {isError && <Msg>Erreur au chargement des thèmes</Msg>}
        {isLoading && <Msg>Chargement des thèmes</Msg>}
        {!isError && !isLoading && (
          <>
            <SelectorWrapper>
              <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionTheme`}>
                Thématique de contrôle
              </Form.ControlLabel>
              <ThemeSelector
                name={`envActions.${currentActionIndex}.actionTheme`}
                themes={themes}
                valueKey="themeLevel1"
              />
            </SelectorWrapper>
            <SelectorWrapper>
              <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionSubTheme`}>
                Sous-thématique de contrôle
              </Form.ControlLabel>
              <ThemeSelector
                name={`envActions.${currentActionIndex}.actionSubTheme`}
                themes={subThemes}
                valueKey="themeLevel2"
              />
            </SelectorWrapper>

            {!!actionTheme && THEME_REQUIRE_PROTECTED_SPECIES.includes(actionTheme) && (
              <SelectorWrapper>
                <ProtectedSpeciesSelector name={`envActions.${currentActionIndex}.protectedSpecies`} />
              </SelectorWrapper>
            )}
          </>
        )}

        <Form.Group>
          <FormikDatePicker
            baseContainer={newWindowContainerRef.current}
            isLight
            isStringDate
            label="Date et heure du contrôle"
            name={`envActions[${currentActionIndex}].actionStartDateTimeUtc`}
            withTime
          />
        </Form.Group>

        <MultiPointPicker
          addButtonLabel="Ajouter un point de contrôle"
          containerName="geom"
          label="Lieu du contrôle"
          name={`envActions[${currentActionIndex}].geom`}
        />

        <Separator />

        <ActionSummary>
          <ActionFieldWrapper>
            <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionNumberOfControls`}>
              Nombre total de contrôles
            </Form.ControlLabel>
            <NumberOfControls min={0} name={`envActions.${currentActionIndex}.actionNumberOfControls`} size="sm" />
          </ActionFieldWrapper>
          <ActionFieldWrapper>
            <ActionTargetSelector
              currentActionIndex={currentActionIndex}
              onChange={onTargetTypeChange}
              value={actionTargetType}
            />
          </ActionFieldWrapper>
          <ActionFieldWrapper>
            <VehicleTypeSelector
              currentActionIndex={currentActionIndex}
              disabled={actionTargetType !== actionTargetTypeEnum.VEHICLE.code}
              onChange={onVehicleTypeChange}
              value={vehicleType}
            />
          </ActionFieldWrapper>
        </ActionSummary>

        <FieldArray
          name={`envActions[${currentActionIndex}].infractions`}
          // eslint-disable-next-line react/jsx-props-no-spreading
          render={props => (
            <InfractionsForm canAddInfraction={canAddInfraction} currentActionIndex={currentActionIndex} {...props} />
          )}
        />
      </FormBody>
    </>
  )
}

const Header = styled.div`
  margin-bottom: 24px;
  display: flex;
`
const FormBody = styled.div`
  display: flex;
  flex-direction: column;
`
const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  display: inline-block;
  color: ${COLORS.charcoal};
`

const Msg = styled.div``

const SelectorWrapper = styled.div`
  height: 58px;
  margin-bottom: 16px;
`

const Separator = styled.hr`
  border-color: ${COLORS.slateGray};
`

const ActionSummary = styled(Form.Group)`
  height: 58px;
  flex-shrink: 0;
  display: flex;
`

const ActionFieldWrapper = styled.div`
  :not(:first-child) {
    margin-left: 8px;
  }
`

const ControlIcon = styled(ControlIconSVG)`
  color: ${COLORS.gunMetal};
  margin-right: 8px;
  margin-top: 2px;
  width: 24px;
`

const SubTitle = styled.div`
  font-size: 16px;
  display: inline-block;
`
const DeleteIcon = styled(DeleteSVG)`
  color: ${COLORS.maximumRed};
`

const IconButtonRight = styled(IconButton)`
  margin-left: auto;
`
const NumberOfControls = styled(FormikInputNumberGhost)`
  width: 150px !important;
`
