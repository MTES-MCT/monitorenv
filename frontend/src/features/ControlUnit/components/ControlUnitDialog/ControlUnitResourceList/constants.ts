import { getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { object, string } from 'yup'

import { ControlUnit } from '../../../../../domain/entities/controlUnit'

import type { ControlUnitResourceFormValues } from './types'

export const CONTROL_UNIT_RESOURCE_FORM_SCHEMA = object().shape({
  baseId: string().required('Veuillez choisir une base.'),
  type: string().required('Veuillez choisir un type.')
})

export const CONTROL_UNIT_RESOURCE_TYPES_AS_OPTIONS = getOptionsFromLabelledEnum(
  ControlUnit.ControlUnitResourceType,
  true
).filter(
  controlUnitResourceTypeAsOption =>
    controlUnitResourceTypeAsOption.label !== ControlUnit.ControlUnitResourceType.UNKNOWN
)

export const INITIAL_CONTROL_UNIT_RESOURCE_FORM_VALUES: ControlUnitResourceFormValues = {
  baseId: undefined,
  controlUnitId: undefined,
  name: undefined,
  note: undefined,
  photo: undefined,
  type: undefined
}
