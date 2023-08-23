import type { Port } from '../../../domain/entities/port/types'
import type { UndefineExceptArrays } from '@mtes-mct/monitor-ui'

export type PortFormValues = UndefineExceptArrays<Port.NewPortData>
