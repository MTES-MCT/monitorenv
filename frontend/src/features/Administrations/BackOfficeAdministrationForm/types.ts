import type { Administration } from '../../../domain/entities/administration'
import type { UndefineExceptArrays } from '@mtes-mct/monitor-ui'

export type AdministrationFormValues = UndefineExceptArrays<Administration.NewAdministrationData>
