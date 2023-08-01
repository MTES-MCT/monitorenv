import {
  Accent,
  CustomSearch,
  FieldError,
  FormikSelect,
  FormikTextInput,
  Icon,
  IconButton,
  MultiRadio,
  OPENLAYERS_PROJECTION,
  WSG84_PROJECTION
} from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { reduce } from 'lodash'
import { GeoJSON } from 'ol/format'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import { useGetSemaphoresQuery } from '../../../api/semaphoresAPI'
import { Reporting, ReportingSourceEnum, reportingSourceLabels } from '../../../domain/entities/reporting'
import { setZoomToCenter } from '../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../hooks/useAppDispatch'

import type { Point } from 'ol/geom'

export function Source() {
  const dispatch = useAppDispatch()
  const { data: semaphores } = useGetSemaphoresQuery()
  const { data: units } = useGetControlUnitsQuery()

  const sourceOptions = Object.values(reportingSourceLabels)
  const { errors, setFieldValue, values } = useFormikContext<Reporting>()

  // Semaphores
  const semaphoresOptions = useMemo(
    () =>
      reduce(
        semaphores?.entities,
        (labels, semaphore) => {
          if (semaphore) {
            labels.push({ label: semaphore.unit || semaphore.name, value: semaphore.id })
          }

          return labels
        },
        [] as { label: string; value: number }[]
      ).sort((a, b) => a.label.localeCompare(b.label)),
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

  const handleZoomToSemaphore = () => {
    // Zoom to semaphore
    if (values.semaphoreId) {
      const geom = semaphores?.entities[values.semaphoreId]?.geom
      const center = (
        new GeoJSON().readGeometry(geom, {
          dataProjection: WSG84_PROJECTION,
          featureProjection: OPENLAYERS_PROJECTION
        }) as Point
      )?.getCoordinates()
      if (center) {
        dispatch(setZoomToCenter(center))
      }
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
        <SemaphoreWrapper>
          <FormikSelect
            customSearch={customSearchSemaphore}
            data-cy="add-semaphore-source"
            label="Nom du Sémaphore"
            name="semaphoreId"
            options={semaphoresOptions || []}
            searchable
          />
          <IconButton accent={Accent.TERTIARY} Icon={Icon.FocusZones} onClick={handleZoomToSemaphore} />
        </SemaphoreWrapper>
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

const SemaphoreWrapper = styled.div`
  display: flex;
  gap: 8px;
  > div {
    flex: 1;
  }
  > button {
    align-self: self-end;
  }
`
