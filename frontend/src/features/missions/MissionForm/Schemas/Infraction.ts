import { VesselTypeEnum } from 'domain/entities/vesselType'
import * as Yup from 'yup'

import {
  type AdministrativeResponseType,
  FormalNoticeEnum,
  InfractionTypeEnum,
  type EnvActionControl,
  type Infraction
} from '../../../../domain/entities/missions'

// DELETE ME (23/07/2024): Workaround before Yup's release v1.0.0
type TestContextExtended = Yup.TestContext & {
  from: {
    value: EnvActionControl
  }[]
}

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
  administrativeResponse: Yup.mixed<AdministrativeResponseType>().required(),
  companyName: Yup.string().optional().nullable(),
  controlledPersonIdentity: Yup.string().nullable(),
  formalNotice: Yup.mixed().oneOf(Object.values(FormalNoticeEnum)).required(),
  id: Yup.string().required(),
  imo: Yup.string().nullable(),
  infractionType: Yup.mixed().oneOf(Object.values(InfractionTypeEnum)).required(),
  mmsi: Yup.string().nullable(),
  natinf: Yup.array()
    .of(Yup.string().ensure())
    .when('infractionType', {
      is: InfractionTypeEnum.WAITING,
      otherwise: schema => schema.compact().min(1),
      then: schema => schema.compact().min(0)
    })
    .ensure(),
  nbTarget: Yup.number()
    .min(1, 'le nombre minimum de cible est 1')
    .required('Le nombre de cibles est obligatoire')
    .test({
      message: 'Le nombre de cibles excède le nombre total de contrôles',
      test: (value, context) => {
        const currentInfractionId = (context.parent as Infraction).id

        if (value) {
          const currentEnvActionControl = (context as TestContextExtended).from[1]
          if (currentEnvActionControl) {
            const { actionNumberOfControls, infractions } = currentEnvActionControl.value
            if (!actionNumberOfControls) {
              return false
            }
            const unselectedInfractionNumber = infractions
              .filter(infraction => infraction.id !== currentInfractionId)
              .reduce((sumNbTarget, infraction) => sumNbTarget + infraction.nbTarget, 0)
            const nbTargetMax = actionNumberOfControls - unselectedInfractionNumber

            return value <= nbTargetMax
          }
        }

        return true
      }
    }),
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
  administrativeResponse: Yup.mixed<AdministrativeResponseType>().oneOf(['SANCTION', 'REGULARIZATION']).required(),
  formalNotice: Yup.mixed().oneOf([FormalNoticeEnum.YES, FormalNoticeEnum.NO]).required(),
  infractionType: Yup.mixed().oneOf([InfractionTypeEnum.WITH_REPORT, InfractionTypeEnum.WITHOUT_REPORT]).required()
})
