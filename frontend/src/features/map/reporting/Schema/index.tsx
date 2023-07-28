import _ from 'lodash'
import * as Yup from 'yup'

import { ReportingSourceEnum, type Reporting } from '../../../../domain/entities/reporting'

const MissionZoneSchema = Yup.object().test({
  message: 'Veuillez définir la localisation du signalement',
  test: val => val && !_.isEmpty(val?.coordinates)
})

export const ReportingSchema: Yup.SchemaOf<Reporting> = Yup.object()
  .shape({
    controlUnitId: Yup.number().when('sourceType', (sourceType, schema) => {
      if (sourceType === ReportingSourceEnum.CONTROL_UNIT) {
        return schema.nullable().required('Veuillez définir une source au signalement')
      }

      return schema.nullable()
    }),
    geom: MissionZoneSchema,
    reportType: Yup.string().nullable().required('Veuillez définir le type de signalement'),
    semaphoreId: Yup.number().when('sourceType', (sourceType, schema) => {
      if (sourceType === ReportingSourceEnum.SEMAPHORE) {
        return schema.nullable().required('Veuillez définir une source au signalement')
      }

      return schema.nullable()
    }),
    sourceName: Yup.string().when('sourceType', (sourceType, schema) => {
      if (sourceType === ReportingSourceEnum.OTHER) {
        return schema.nullable().required('Veuillez définir une source au signalement')
      }

      return schema.nullable()
    }),
    sourceType: Yup.string().nullable().required()
  })
  .required()
