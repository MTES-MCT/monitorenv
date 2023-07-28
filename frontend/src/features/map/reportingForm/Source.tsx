import { CustomSearch, FormikMultiRadio, FormikSelect, FormikTextInput } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import { useGetSemaphoresQuery } from '../../../api/semaphoresAPI'
import { Reporting, ReportingSourceEnum, reportingSourceLabels } from '../../../domain/entities/reporting'

export function Source() {
  const { data: semaphores } = useGetSemaphoresQuery()
  const { data: units } = useGetControlUnitsQuery()

  const sourceOptions = Object.values(reportingSourceLabels)
  const { values } = useFormikContext<Reporting>()

  // Semaphores
  const semaphoresOptions = useMemo(
    () => semaphores?.map(semaphore => ({ label: semaphore.unit || semaphore.name, value: semaphore.id })),
    [semaphores]
  )

  const customSearchSemaphore = useMemo(
    () =>
      new CustomSearch(semaphoresOptions || [], ['label'], {
        isStrict: true
      }),
    [semaphoresOptions]
  )

  // Control Units
  const controlUnitsOptions = useMemo(
    () =>
      units
        ?.filter(unit => !unit.isArchived)
        .sort((a, b) => a?.name?.localeCompare(b?.name))
        .map(unit => ({ label: unit.name, value: unit.id })) || [],
    [units]
  )

  const customSearchControlUnits = useMemo(
    () =>
      new CustomSearch(controlUnitsOptions || [], ['label'], {
        isStrict: true,
        threshold: 0.5
      }),
    [controlUnitsOptions]
  )

  return (
    <>
      <FormikMultiRadio isErrorMessageHidden isInline label="Source" name="sourceType" options={sourceOptions} />
      {values?.sourceType === ReportingSourceEnum.SEMAPHORE && (
        <FormikSelect
          customSearch={customSearchSemaphore}
          label="Nom du Sémaphore"
          name="semaphoreId"
          options={semaphoresOptions || []}
          searchable
        />
      )}
      {values?.sourceType === ReportingSourceEnum.UNIT && (
        <FormikSelect
          customSearch={customSearchControlUnits}
          label="Nom de l'unité"
          name="controlUnitId"
          options={controlUnitsOptions || []}
          searchable
        />
      )}

      {values?.sourceType === ReportingSourceEnum.OTHER && (
        <FormikTextInput label="Nom, société ..." name="sourceName" />
      )}
    </>
  )
}
