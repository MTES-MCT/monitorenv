import * as Yup from 'yup'

import { Mission } from '../../../mission.type'

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

export const NewInfractionSchema: Yup.SchemaOf<Mission.Infraction> = Yup.object().shape({
  companyName: Yup.string().optional().nullable(),
  controlledPersonIdentity: Yup.string().nullable(),
  formalNotice: Yup.mixed().oneOf(Object.values(Mission.FormalNoticeEnum)).required(),
  id: Yup.string().required(),
  infractionType: Yup.mixed().oneOf(Object.values(Mission.InfractionTypeEnum)).required(),
  natinf: Yup.array()
    .of(Yup.string().ensure())
    .when('infractionType', {
      is: Mission.InfractionTypeEnum.WAITING,
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
  vesselType: Yup.mixed().oneOfOptional(Object.values(Mission.VesselTypeEnum))
})

export const ClosedInfractionSchema: Yup.SchemaOf<Mission.Infraction> = NewInfractionSchema.shape({
  formalNotice: Yup.mixed().oneOf([Mission.FormalNoticeEnum.YES, Mission.FormalNoticeEnum.NO]).required(),
  infractionType: Yup.mixed()
    .oneOf([Mission.InfractionTypeEnum.WITH_REPORT, Mission.InfractionTypeEnum.WITHOUT_REPORT])
    .required()
})
