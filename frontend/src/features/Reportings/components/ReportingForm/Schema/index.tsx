import {
  ReportingSourceEnum,
  ReportingTypeEnum,
  type Reporting,
  type ReportingSource,
  type TargetDetails
} from 'domain/entities/reporting'
import { ReportingTargetTypeEnum } from 'domain/entities/targetType'
import { isEmpty } from 'lodash'
import * as Yup from 'yup'

import type { ThemeAPI } from 'domain/entities/themes'
import type { VesselTypeEnum } from 'domain/entities/vesselType'
import type { GeoJSON } from 'domain/types/GeoJSON'

const ReportingSourceSchema: Yup.Schema<Omit<ReportingSource, 'id' | 'reportingId' | 'displayedSource'>> =
  Yup.object().shape({
    controlUnitId: Yup.number().when('sourceType', {
      is: ReportingSourceEnum.CONTROL_UNIT,
      otherwise: schema => schema.nullable(),
      then: schema => schema.nullable().required('Veuillez définir une source au signalement')
    }),
    semaphoreId: Yup.number().when('sourceType', {
      is: ReportingSourceEnum.SEMAPHORE,
      otherwise: schema => schema.nullable(),
      then: schema => schema.nullable().required('Veuillez définir une source au signalement')
    }),
    sourceName: Yup.string().when('sourceType', {
      is: ReportingSourceEnum.OTHER,
      otherwise: schema => schema.nullable(),
      then: schema => schema.nullable().required('Veuillez définir une source au signalement')
    }),
    sourceType: Yup.string()
      .oneOf(Object.values(ReportingSourceEnum))
      .required('Veuillez définir une source au signalement')
  })

export const ReportingSchema: Yup.Schema<
  Partial<
    Omit<
      Reporting,
      | 'attachedMission'
      | 'attachedEnvActionId'
      | 'attachedToMissionAtUtc'
      | 'controlStatus'
      | 'detachedFromMissionAtUtc'
      | 'id'
      | 'isArchived'
      | 'missionId'
      | 'reportingId'
      | 'updatedAtUtc'
    >
  >
> = Yup.object()
  .shape({
    actionTaken: Yup.string().optional(),
    createdAt: Yup.string().required('Veuillez définir la date de signalement'),
    description: Yup.string().when('targetType', {
      is: ReportingTargetTypeEnum.OTHER,
      otherwise: schema => schema.optional(),
      then: schema => schema.required('Veuillez définir des informations sur la cible')
    }),
    geom: Yup.mixed<GeoJSON.MultiPolygon>()
      .test({
        message: 'Veuillez définir une zone de vigilance',
        name: 'has-geom',
        test: val => val && !isEmpty(val?.coordinates)
      })
      .required(),
    hasNoUnitAvailable: Yup.boolean().optional(),
    isControlRequired: Yup.boolean().optional(),
    isInfractionProven: Yup.boolean().required("Veuillez définir si l'infraction est avérée"),
    openBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le trigramme')
      .max(3, 'Maximum 3 lettres pour le trigramme')
      .required('Requis'),
    reportingSources: Yup.array().of(ReportingSourceSchema).min(1).required(),
    reportType: Yup.mixed<ReportingTypeEnum>()
      .oneOf(Object.values(ReportingTypeEnum))
      .required('Veuillez définir le type de signalement'),
    subThemeIds: Yup.array()
      .of(Yup.number().required())
      .ensure()
      .required()
      .min(1, 'Veuillez définir les sous-thématiques du signalement'),
    tags: Yup.array().ensure().optional(),
    targetDetails: Yup.array<TargetDetails>()
      .of(
        Yup.object().shape({
          externalReferenceNumber: Yup.string().optional(),
          imo: Yup.string().optional(),
          mmsi: Yup.string().optional(),
          operatorName: Yup.string().optional(),
          size: Yup.number().optional(),
          vesselName: Yup.string().optional(),
          vesselType: Yup.string<VesselTypeEnum>().optional()
        })
      )
      .optional(),
    targetType: Yup.string<ReportingTargetTypeEnum>().optional(),
    theme: Yup.mixed<ThemeAPI>().required('Veuillez définir la thématique du signalement'),
    themeId: Yup.number().required('Veuillez définir la thématique du signalement'),
    validityTime: Yup.number()
      .required('Veuillez définir la durée de validité du signalement')
      .min(1, 'Veuillez définir une durée de validité supérieure à 0'),
    vehicleType: Yup.string().optional(),
    withVHFAnswer: Yup.boolean().optional()
  })
  .required()
