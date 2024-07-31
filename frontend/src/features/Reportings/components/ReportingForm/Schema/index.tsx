import { ReportingSourceEnum, type Reporting, type ReportingSource } from 'domain/entities/reporting'
import { ReportingTargetTypeEnum } from 'domain/entities/targetType'
import _ from 'lodash'
import * as Yup from 'yup'

const ReportingZoneSchema = Yup.object().test({
  message: 'Veuillez définir la localisation du signalement',
  test: val => val && !_.isEmpty(val?.coordinates)
})
const ReportingSourceSchema: Yup.SchemaOf<Omit<ReportingSource, 'id' | 'reportingId'>> = Yup.object().shape({
  controlUnitId: Yup.number().when('sourceType', (sourceType: ReportingSourceEnum, schema: Yup.NumberSchema) => {
    if (sourceType === ReportingSourceEnum.CONTROL_UNIT) {
      return schema.nullable().required('Veuillez définir une source au signalement')
    }

    return schema.nullable()
  }),
  semaphoreId: Yup.number().when('sourceType', (sourceType: ReportingSourceEnum, schema: Yup.NumberSchema) => {
    if (sourceType === ReportingSourceEnum.SEMAPHORE) {
      return schema.nullable().required('Veuillez définir une source au signalement')
    }

    return schema.nullable()
  }),
  sourceName: Yup.string().when('sourceType', (sourceType: ReportingSourceEnum, schema: Yup.StringSchema) => {
    if (sourceType === ReportingSourceEnum.OTHER) {
      return schema.nullable().required('Veuillez définir une source au signalement')
    }

    return schema.nullable()
  }),
  sourceType: Yup.mixed()
    .oneOf(Object.values(ReportingSourceEnum))
    .nullable()
    .required('Veuillez définir une source au signalement')
})

export const ReportingSchema: Yup.SchemaOf<Reporting> = Yup.object()
  .shape({
    createdAt: Yup.date().nullable().required('Veuillez définir la date de signalement'),
    description: Yup.string().when('targetType', (targetType: ReportingTargetTypeEnum, schema: Yup.StringSchema) => {
      if (targetType === ReportingTargetTypeEnum.OTHER) {
        return schema.required('Veuillez renseigner des informations sur la cible')
      }

      return schema.nullable()
    }),
    geom: ReportingZoneSchema,
    openBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le trigramme')
      .max(3, 'Maximum 3 lettres pour le trigramme')
      .nullable()
      .required('Requis'),
    reportingSources: Yup.array().of(ReportingSourceSchema).ensure().required(),
    reportType: Yup.string().nullable().required('Veuillez définir le type de signalement'),
    subThemeIds: Yup.array()
      .of(Yup.number().required())
      .ensure()
      .required()
      .min(1, 'Veuillez définir les sous-thématiques du signalement'),
    themeId: Yup.number().nullable().required('Veuillez définir la thématique du signalement'),
    validityTime: Yup.number()
      .nullable()
      .required('Veuillez définir la durée de validité du signalement')
      .min(1, 'Veuillez définir une durée de validité supérieure à 0')
  })
  .required()
