import { VesselTypeEnum } from 'domain/entities/vesselType'
import * as Yup from 'yup'

import {
  FormalNoticeEnum,
  LegalSanctionEnum,
  type AdministrativeSanctionType,
  type Infraction
} from '../../../../domain/entities/missions'

Yup.addMethod(Yup.mixed, 'oneOfOptional', (arr, message) =>
  Yup.mixed().test({
    exclusive: true,
    message,
    name: 'oneOfOptional',
    params: {},
    test(value) {
      return value == null ? true : arr.includes(value)
    }
  })
)

export const NewInfractionSchema: Yup.SchemaOf<Infraction> = Yup.object().shape({
  administrativeSanction: Yup.mixed<AdministrativeSanctionType>().required(),
  companyName: Yup.string().optional().nullable(),
  controlledPersonIdentity: Yup.string().nullable(),
  formalNotice: Yup.mixed().oneOf(Object.values(FormalNoticeEnum)).required(),
  id: Yup.string().required(),
  imo: Yup.string().nullable(),
  legalSanction: Yup.mixed().oneOf(Object.values(LegalSanctionEnum)).required(),
  mmsi: Yup.string().nullable(),
  natinf: Yup.array()
    .of(Yup.string().ensure())
    .when('legalSanction', {
      is: LegalSanctionEnum.WAITING,
      otherwise: schema => schema.compact().min(1),
      then: schema => schema.compact().min(0)
    })
    .ensure(),
  observations: Yup.string().nullable(),
  registrationNumber: Yup.string().nullable(),
  relevantCourt: Yup.string().nullable(),
  toProcess: Yup.boolean().required(),
  vesselName: Yup.string().nullable(),
  vesselSize: Yup.number().nullable(),
  // @ts-ignore
  // Property 'oneOfOptional' does not exist on type 'MixedSchema<any, AnyObject, any>'
  vesselType: Yup.mixed().oneOfOptional(Object.values(VesselTypeEnum))
})

export const CompletionInfractionSchema: Yup.SchemaOf<Infraction> = NewInfractionSchema.shape({
  administrativeSanction: Yup.mixed<AdministrativeSanctionType>().oneOf(['SANCTION', 'REGULARIZATION']).required(),
  formalNotice: Yup.mixed().oneOf([FormalNoticeEnum.YES, FormalNoticeEnum.NO]).required(),
  legalSanction: Yup.mixed().oneOf([LegalSanctionEnum.WITH_REPORT, LegalSanctionEnum.WITHOUT_REPORT]).required()
})
