import { useGetRegulatoryAreasToCompleteQuery } from '@api/regulatoryAreasAPI'
import { useGetSeaFrontsQuery } from '@api/seaFrontsAPI'
import { regulatoryAreaBoActions } from '@features/RegulatoryArea/slice'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { CustomSearch, FormikSelect, OPENLAYERS_PROJECTION, Select, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { useFormikContext } from 'formik'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import { useMemo } from 'react'
import styled from 'styled-components'

import { SubTitle } from './style'

import type { MainRefReg } from './RegulatoryTexts'
import type { GeoJSON } from 'domain/types/GeoJSON'
import type { Coordinate } from 'ol/coordinate'

export function Localisation({
  isEditing,
  onChangeRefReg
}: {
  isEditing: boolean
  onChangeRefReg: (refReg: MainRefReg) => void
}) {
  const dispatch = useAppDispatch()
  const { setFieldValue, values } = useFormikContext<RegulatoryArea.RegulatoryAreaFromAPI>()

  const { data: regulatoryAreasToComplete } = useGetRegulatoryAreasToCompleteQuery(undefined, { skip: isEditing })

  const regulatoryAreaDefaultGeom = useMemo(() => {
    if (values.geom && values.id && values.refReg) {
      return {
        label: String(values.id),
        value: {
          geom: values.geom,
          id: values.id,
          refReg: values.refReg
        }
      }
    }

    return undefined
  }, [values.geom, values.id, values.refReg])

  const geomOptions = useMemo(() => {
    const options =
      regulatoryAreasToComplete?.map(regulatoryArea => ({
        label: String(regulatoryArea.id),
        value: {
          geom: regulatoryArea.geom,
          id: regulatoryArea.id,
          refReg: regulatoryArea.refReg
        }
      })) ?? []

    if (regulatoryAreaDefaultGeom && !regulatoryAreasToComplete?.find(({ id }) => id === values.id)) {
      options.push(regulatoryAreaDefaultGeom)
    }

    return options
  }, [regulatoryAreaDefaultGeom, regulatoryAreasToComplete, values.id])

  const { data: seaFronts } = useGetSeaFrontsQuery()
  const seaFrontsAsOptions = (seaFronts ?? [])
    .map(facade => ({ label: facade, value: facade }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const setGeometryAndRefReg = (nextGeom: { geom: GeoJSON.MultiPolygon; id: number; refReg: string } | undefined) => {
    if (!nextGeom || nextGeom.geom.coordinates.length === 0) {
      return
    }
    setFieldValue('geom', nextGeom.geom)
    setFieldValue('id', nextGeom.id)
    setFieldValue('refReg', nextGeom.refReg)
    onChangeRefReg({ date: values.date, dateFin: values.dateFin, refReg: nextGeom.refReg })
    dispatch(regulatoryAreaBoActions.setNewRegulatoryAreaId(nextGeom?.id))
    const extent = transformExtent(
      boundingExtent(nextGeom.geom.coordinates.flat().flat() as Coordinate[]),
      WSG84_PROJECTION,
      OPENLAYERS_PROJECTION
    )
    dispatch(setFitToExtent(extent))
  }

  const renderMenuItem = (label, item) => (
    <GeomContainer title={label}>
      <p>{label}</p>
      <GeomRefReg>{item.optionValue.refReg}</GeomRefReg>
    </GeomContainer>
  )

  const geomCustomSearch = new CustomSearch(geomOptions ?? [], ['label', 'value.refReg'], {
    isStrict: true
  })

  return (
    <>
      <SubTitle>LOCALISATION DE LA ZONE RÉGLEMENTAIRE</SubTitle>
      <InlineFieldsContainer>
        <Select
          key={geomOptions.length}
          customSearch={geomCustomSearch}
          disabled={isEditing}
          isCleanable={false}
          isRequired
          label="Géométrie"
          name="geom"
          onChange={setGeometryAndRefReg}
          options={geomOptions}
          optionValueKey="id"
          renderMenuItem={renderMenuItem}
          style={{ flex: 1 }}
          value={regulatoryAreaDefaultGeom?.value}
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
