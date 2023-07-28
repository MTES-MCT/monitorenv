import { CustomSearch, FieldError, FormikSelect, FormikTextInput, MultiRadio } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import { useGetSemaphoresQuery } from '../../../api/semaphoresAPI'
import { Reporting, ReportingSourceEnum, reportingSourceLabels } from '../../../domain/entities/reporting'

export function Source() {
  const { data: semaphores } = useGetSemaphoresQuery()
  const { data: units } = useGetControlUnitsQuery()

  const sourceOptions = Object.values(reportingSourceLabels)
  const { errors, setFieldValue, values } = useFormikContext<Reporting>()

  // Semaphores
  const semaphoresOptions = useMemo(
    () =>
      semaphores
        ?.map(semaphore => ({ label: semaphore.unit || semaphore.name, value: semaphore.id }))
        .sort((a, b) => a.label.localeCompare(b.label)),
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

  const changeSourceType = sourceType => {
    setFieldValue('sourceType', sourceType)
    if (sourceType === ReportingSourceEnum.SEMAPHORE) {
      setFieldValue('controlUnitId', undefined)
      setFieldValue('sourceName', undefined)
    } else if (sourceType === ReportingSourceEnum.CONTROL_UNIT) {
      setFieldValue('sourceName', undefined)
      setFieldValue('semaphoreId', undefined)
    } else {
      setFieldValue('controlUnitId', undefined)
      setFieldValue('semaphoreId', undefined)
    }
  }

  return (
    <>
      <div>
        <MultiRadio
          isInline
          label="Source"
          name="sourceType"
          onChange={changeSourceType}
          options={sourceOptions}
          value={values.sourceType}
        />
        {errors.sourceType && <FieldError>{errors.sourceType}</FieldError>}
      </div>
      {values?.sourceType === ReportingSourceEnum.SEMAPHORE && (
        <FormikSelect
          customSearch={customSearchSemaphore}
          label="Nom du Sémaphore"
          name="semaphoreId"
          options={semaphoresOptions || []}
          searchable
        />
      )}
      {values?.sourceType === ReportingSourceEnum.CONTROL_UNIT && (
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
