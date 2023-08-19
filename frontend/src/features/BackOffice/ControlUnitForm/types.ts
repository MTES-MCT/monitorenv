import type { ControlUnit } from '../../../domain/entities/controlUnit/types'
import type { UndefineExceptArrays } from '../../../types'

export type ControlUnitFormValues = UndefineExceptArrays<ControlUnit.NewControlUnitData>
