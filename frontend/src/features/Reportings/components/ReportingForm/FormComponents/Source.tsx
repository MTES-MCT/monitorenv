import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useGetSemaphoresQuery } from '@api/semaphoresAPI'
import { Separator } from '@features/Reportings/style'
import { createNewReportingSource } from '@features/Reportings/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import {
  Accent,
  Button,
  CustomSearch,
  FormikSelect,
  FormikTextInput,
  getOptionsFromLabelledEnum,
  Icon,
  IconButton,
  MultiRadio,
  OPENLAYERS_PROJECTION,
  THEME,
  WSG84_PROJECTION
} from '@mtes-mct/monitor-ui'
import {
  ReportingSourceEnum,
  ReportingSourceLabels,
  type Reporting,
  type ReportingSource
} from 'domain/entities/reporting'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { setZoomToCenter } from 'domain/shared_slices/Map'
import { setIsSemaphoreHighlighted, setSelectedSemaphore } from 'domain/shared_slices/SemaphoresSlice'
import { useFormikContext } from 'formik'
import { reduce } from 'lodash'
import { GeoJSON } from 'ol/format'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { Point } from 'ol/geom'

type SourceProps = {
  index: number
  push: (reportingSource: ReportingSource) => void
  remove: (index: number) => void
}
export function Source({ index, push, remove }: SourceProps) {
  const dispatch = useAppDispatch()
  const { data: semaphores } = useGetSemaphoresQuery()
  const { data: units } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const sourceOptions = getOptionsFromLabelledEnum(ReportingSourceLabels)
  const { setFieldValue, values } = useFormikContext<Reporting>()

  const reportingSource = values.reportingSources[index]

  // Semaphores
  const semaphoresOptions = useMemo(
    () =>
      reduce(
        semaphores?.entities,
        (labels, semaphore) => {
          if (semaphore) {
            labels.push({ label: semaphore.unit ?? semaphore.name, value: semaphore.id })
          }

          return labels
        },
        [] as { label: string; value: number }[]
      ).sort((a, b) => a.label.localeCompare(b.label)),
    [semaphores]
  )

  const customSearchSemaphore = useMemo(
    () =>
      new CustomSearch(semaphoresOptions, ['label'], {
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
        .map(unit => ({ label: unit.name, value: unit.id })) ?? [],
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

  const changeSourceType = (sourceType: string | undefined) => {
    setFieldValue(`reportingSources[${index}].sourceType`, sourceType)
    if (sourceType === ReportingSourceEnum.SEMAPHORE) {
      setFieldValue(`reportingSources[${index}].controlUnitId`, undefined)
      setFieldValue(`reportingSources[${index}].sourceName`, undefined)
    } else if (sourceType === ReportingSourceEnum.CONTROL_UNIT) {
      setFieldValue(`reportingSources[${index}].sourceName`, undefined)
      setFieldValue(`reportingSources[${index}].semaphoreId`, undefined)
    } else {
      setFieldValue(`reportingSources[${index}].controlUnitId`, undefined)
      setFieldValue(`reportingSources[${index}].semaphoreId`, undefined)
    }
  }

  const zoomToSemaphore = (semaphoreId: number) => {
    dispatch(
      setDisplayedItems({
        displaySemaphoresLayer: true
      })
    )
    dispatch(setSelectedSemaphore(semaphoreId))

    const geom = semaphores?.entities[semaphoreId]?.geom
    const center = (
      new GeoJSON().readGeometry(geom, {
        dataProjection: WSG84_PROJECTION,
        featureProjection: OPENLAYERS_PROJECTION
      }) as Point
    )?.getCoordinates()
    if (center) {
      dispatch(setZoomToCenter(center))
    }

    // we want to highlight the semaphore for 5 seconds
    dispatch(setIsSemaphoreHighlighted(true))
    window.setTimeout(() => {
      dispatch(setIsSemaphoreHighlighted(false))
    }, 5000)
  }

  return (
    reportingSource && (
      <>
        {index !== 0 && <Separator />}
        <div>
          <MultiRadio
            data-cy={`reporting-source-selector-${index}`}
            isInline
            isRequired
            label={`Source (${index + 1})`}
            name={`reportingSources[${index}].sourceType`}
            onChange={changeSourceType}
            options={sourceOptions}
            // type error if I use styledComponent to style it
            style={{ float: 'left' }}
            value={reportingSource.sourceType}
          />
          {index !== 0 && (
            <DeleteButton
              accent={Accent.SECONDARY}
              aria-label="Supprimer cette source"
              color={THEME.color.maximumRed}
              Icon={Icon.Delete}
              onClick={() => remove(index)}
            />
          )}
        </div>

        {reportingSource.sourceType === ReportingSourceEnum.SEMAPHORE && (
          <SemaphoreWrapper>
            <FormikSelect
              customSearch={customSearchSemaphore}
              data-cy="add-semaphore-source"
              isRequired
              label="Nom du Sémaphore"
              name={`reportingSources[${index}].semaphoreId`}
              options={semaphoresOptions || []}
              searchable
            />
            {reportingSource.semaphoreId && (
              <IconButton
                accent={Accent.TERTIARY}
                Icon={Icon.FocusZones}
                onClick={() => zoomToSemaphore(reportingSource.semaphoreId!)}
              />
            )}
          </SemaphoreWrapper>
        )}
        {reportingSource.sourceType === ReportingSourceEnum.CONTROL_UNIT && (
          <FormikSelect
            customSearch={customSearchControlUnits}
            isRequired
            label="Nom de l'unité"
            name={`reportingSources[${index}].controlUnitId`}
            options={controlUnitsOptions || []}
            searchable
          />
        )}

        {reportingSource.sourceType === ReportingSourceEnum.OTHER && (
          <FormikTextInput isRequired label="Nom, société ..." name={`reportingSources[${index}].sourceName`} />
        )}
        {index === values.reportingSources.length - 1 && (
          <Button
            accent={Accent.SECONDARY}
            Icon={Icon.Plus}
            isFullWidth
            onClick={() => push(createNewReportingSource())}
          >
            Ajouter une source
          </Button>
        )}
      </>
    )
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

const DeleteButton = styled(IconButton)`
  margin-left: auto;
`
