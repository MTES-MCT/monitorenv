import { useGetRegulatoryAreasToCompleteQuery } from '@api/regulatoryAreasAPI'
import { useGetSeaFrontsQuery, useLazyComputeSeaFrontFromGeometryQuery } from '@api/seaFrontsAPI'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { CustomSearch, FormikSelect, OPENLAYERS_PROJECTION, Select, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { useFormikContext } from 'formik'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'
import type { GeoJSON } from 'domain/types/GeoJSON'
import type { Coordinate } from 'ol/coordinate'

export function GroupLocalisation() {
  const { setFieldValue } = useFormikContext<RegulatoryArea.RegulatoryAreaGroupToApi>()
  const dispatch = useAppDispatch()
  const { data: seaFronts } = useGetSeaFrontsQuery()
  const { data: regulatoryAreasToComplete } = useGetRegulatoryAreasToCompleteQuery(undefined)

  const [computeSeaFrontFromGeom] = useLazyComputeSeaFrontFromGeometryQuery()

  const geomOptions = useMemo(() => {
    const options =
      regulatoryAreasToComplete?.map(regulatoryArea => ({
        label: String(regulatoryArea.id),
        value: {
          geom: regulatoryArea.geom,
          id: regulatoryArea.id
        }
      })) ?? []

    return options
  }, [regulatoryAreasToComplete])

  const seaFrontsAsOptions = (seaFronts ?? [])
    .map(facade => ({ label: facade, value: facade }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const renderMenuItem = (label, item) => (
    <GeomContainer title={label}>
      <p>{label}</p>
      <GeomRefReg>{item.optionValue.id}</GeomRefReg>
    </GeomContainer>
  )

  const geomCustomSearch = new CustomSearch(geomOptions ?? [], ['label', 'value.id'], {
    isStrict: true
  })

  const setGeometry = async (nextGeom: { geom: GeoJSON.MultiPolygon } | undefined) => {
    if (!nextGeom || nextGeom.geom.coordinates.length === 0) {
      return
    }
    setFieldValue('geom', nextGeom.geom)
    const newSeaFront = await computeSeaFrontFromGeom(nextGeom.geom).unwrap()
    setFieldValue('facade', newSeaFront?.seaFront)

    const extent = transformExtent(
      boundingExtent(nextGeom.geom.coordinates.flat().flat() as Coordinate[]),
      WSG84_PROJECTION,
      OPENLAYERS_PROJECTION
    )
    dispatch(setFitToExtent(extent))
  }

  return (
    <>
      <InlineFieldsContainer>
        <Select
          key={geomOptions.length}
          customSearch={geomCustomSearch}
          isRequired
          label="Géométrie"
          name="geom"
          onChange={setGeometry}
          options={geomOptions}
          // optionValueKey="id"
          renderMenuItem={renderMenuItem}
          style={{ flex: 1 }}
          // value={values.id}
        />
        <FormikSelect
          isErrorMessageHidden
          isRequired
          label="Façade"
          name="facade"
          options={seaFrontsAsOptions}
          searchable
          style={{ flex: 1 }}
        />
      </InlineFieldsContainer>
    </>
  )
}

const InlineFieldsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
`

const GeomContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const GeomRefReg = styled.p`
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
