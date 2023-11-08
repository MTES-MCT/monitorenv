import type { Station } from '../../../../domain/entities/station'
import type { UndefineExceptArrays } from '@mtes-mct/monitor-ui'

export type StationFormValues = Omit<UndefineExceptArrays<Station.NewStationData>, 'latitude' | 'longitude'> & {
  coordinates: [number, number] | undefined
  id?: number
}
