import { FormikMultiRadio, FormikSelect, FormikTextInput } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import { useGetSemaphoresQuery } from '../../../api/semaphoresAPI'
import { Report, ReportSourceEnum, reportSourceLabels } from '../../../domain/entities/report'

export function Source() {
  const sourceOptions = Object.values(reportSourceLabels)
  const { values } = useFormikContext<Report>()

  const { data: semaphores } = useGetSemaphoresQuery()
  const semaphoresOptions = useMemo(
    () =>
      semaphores
        ? semaphores.map(semaphore => ({
            label: semaphore.unit || semaphore.name,
            value: semaphore.id
          }))
        : [],
    [semaphores]
  )

  return (
    <>
      <FormikMultiRadio isErrorMessageHidden isInline label="Source" name="sourceType" options={sourceOptions} />
      {values?.sourceType === ReportSourceEnum.SEMAPHORE && (
        <FormikSelect label="Nom du Sémaphore" name="semaphoreId" options={semaphoresOptions} />
      )}
      {values?.sourceType === ReportSourceEnum.OTHER && <FormikTextInput label="Nom, société ..." name="sourceName" />}
    </>
  )
}
