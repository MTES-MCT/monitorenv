import * as Yup from 'yup'

export const RegulatoryAreaFormSchema: Yup.Schema<any> = Yup.object().shape({
  description: Yup.string().optional(),
  geometry: Yup.object()
    .shape({
      coordinates: Yup.array().required('Les coordonnées sont obligatoires'),
      type: Yup.string().oneOf(['Polygon', 'MultiPolygon']).required('La géométrie est obligatoire')
    })
    .required('La géométrie est obligatoire'),
  name: Yup.string().required('Le nom de la zone réglementée est obligatoire'),
  refReg: Yup.string().required('La référence réglementaire est obligatoire'),
  seaFront: Yup.string().optional(),
  tags: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required()
      })
    )
    .optional(),
  themes: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required(),
        name: Yup.string().required()
      })
    )
    .optional(),
  url: Yup.string().url("L'URL doit être valide").required()
})
