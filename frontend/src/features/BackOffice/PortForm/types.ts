import type { Port } from '../../../domain/entities/port/types'
import type { UndefineExceptArrays } from '../../../types'

export type PortFormValues = UndefineExceptArrays<Port.NewPortData>
