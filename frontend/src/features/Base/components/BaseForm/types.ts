import type { Base } from '../../../../domain/entities/base'
import type { UndefineExceptArrays } from '@mtes-mct/monitor-ui'

export type BaseFormValues = Omit<UndefineExceptArrays<Base.NewBaseData>, 'latitude' | 'longitude'> & {
  coordinates: [number, number] | undefined
  id?: number
}
