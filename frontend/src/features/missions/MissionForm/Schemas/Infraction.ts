import * as Yup from 'yup'

import {
  FormalNoticeEnum,
  InfractionTypeEnum,
  type Infraction,
  VesselTypeEnum
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
  companyName: Yup.string().optional().nullable(),
  controlledPersonIdentity: Yup.string().nullable(),
  formalNotice: Yup.mixed().oneOf(Object.values(FormalNoticeEnum)).required(),
  id: Yup.string().required(),
  infractionType: Yup.mixed().oneOf(Object.values(InfractionTypeEnum)).required(),
  natinf: Yup.array()
    .of(Yup.string().ensure())
    .when('infractionType', {
      is: InfractionTypeEnum.WAITING,
      otherwise: schema => schema.compact().min(1),
      then: schema => schema.compact().min(0)
    })
    .ensure(),
  observations: Yup.string().nullable(),
  registrationNumber: Yup.string().nullable(),
  relevantCourt: Yup.string().nullable(),
  toProcess: Yup.boolean().required(),
  vesselSize: Yup.number().nullable(),
  // @ts-ignore
  // Property 'oneOfOptional' does not exist on type 'MixedSchema<any, AnyObject, any>'
  vesselType: Yup.mixed().oneOfOptional(Object.values(VesselTypeEnum))
})

export const ClosedInfractionSchema: Yup.SchemaOf<Infraction> = NewInfractionSchema.shape({
  formalNotice: Yup.mixed().oneOf([FormalNoticeEnum.YES, FormalNoticeEnum.NO]).required(),
  infractionType: Yup.mixed().oneOf([InfractionTypeEnum.WITH_REPORT, InfractionTypeEnum.WITHOUT_REPORT]).required()
})
