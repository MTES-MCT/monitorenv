import type { ControlUnit } from '../../../../domain/entities/controlUnit'
import type { UndefineExceptArrays } from '@mtes-mct/monitor-ui'

export type ControlUnitFormValues = UndefineExceptArrays<ControlUnit.NewControlUnitData>
