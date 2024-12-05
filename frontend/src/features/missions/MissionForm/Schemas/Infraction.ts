import { VesselTypeEnum } from 'domain/entities/vesselType'
import * as Yup from 'yup'

import {
  type AdministrativeResponseType,
  FormalNoticeEnum,
  InfractionTypeEnum,
  type Infraction,
  type NewInfraction,
  InfractionSeizureEnum
} from '../../../../domain/entities/missions'

export const NewInfractionSchema: Yup.ObjectSchema<NewInfraction> = Yup.object().shape({
  administrativeResponse: Yup.mixed<AdministrativeResponseType>().optional(),
  companyName: Yup.string().optional(),
  controlledPersonIdentity: Yup.string().optional(),
  formalNotice: Yup.mixed<FormalNoticeEnum>().oneOf(Object.values(FormalNoticeEnum)).required(),
  id: Yup.string().required(),
  imo: Yup.string().optional(),
  infractionType: Yup.mixed<InfractionTypeEnum>().oneOf(Object.values(InfractionTypeEnum)).required(),
  mmsi: Yup.string().optional(),
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
          const currentEnvActionControl = context.from?.[1]
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
  observations: Yup.string().optional(),
  registrationNumber: Yup.string().optional(),
  seizure: Yup.mixed<InfractionSeizureEnum>().optional(),
  vesselName: Yup.string().optional(),
  vesselSize: Yup.number().optional(),
  vesselType: Yup.string<VesselTypeEnum>().optional()
})

export const CompletionInfractionSchema: Yup.Schema<Infraction> = NewInfractionSchema.shape({
  administrativeResponse: Yup.mixed<AdministrativeResponseType>()
    .oneOf(['SANCTION', 'REGULARIZATION', 'NONE'])
    .required(),
  formalNotice: Yup.mixed<FormalNoticeEnum>().oneOf([FormalNoticeEnum.YES, FormalNoticeEnum.NO]).required(),
  id: Yup.string().required(),
  infractionType: Yup.mixed<InfractionTypeEnum>()
    .oneOf([InfractionTypeEnum.WITH_REPORT, InfractionTypeEnum.WITHOUT_REPORT])
    .required(),
  seizure: Yup.mixed<InfractionSeizureEnum>()
    .oneOf([InfractionSeizureEnum.YES, InfractionSeizureEnum.NO, InfractionSeizureEnum.NONE])
    .required()
})
