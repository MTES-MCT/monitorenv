import { dashboardsAPI } from '@api/dashboardsAPI'
import { getRegulatoryAreasByIds } from '@api/regulatoryLayersAPI'
import { useExportImages } from '@features/Dashboard/hooks/useExportImages'
import { getRegulatoryEnvColorWithAlpha } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Button } from '@mtes-mct/monitor-ui'
import { getTitle } from 'domain/entities/layers/utils'

export function EditableDocButton({ dashboard }) {
  const dispatch = useAppDispatch()

  const { getImages } = useExportImages()
  const regulatoryAreas = useAppSelector(state => getRegulatoryAreasByIds(state, dashboard.regulatoryAreaIds))

  const formattedRegulatoryAreas = regulatoryAreas.map(regulatoryArea => ({
    color: getRegulatoryEnvColorWithAlpha(regulatoryArea.thematique, regulatoryArea.entityName),
    entityName: getTitle(regulatoryArea.entityName),
    facade: regulatoryArea.facade,
    id: regulatoryArea.id,
    layerName: getTitle(regulatoryArea.layerName),
    refReg: regulatoryArea.refReg,
    thematique: regulatoryArea.thematique,
    type: regulatoryArea.type,
    url: regulatoryArea.url
  }))

  // console.log('regulatoryAreas', formattedRegulatoryAreas)
  const exportBrief = async () => {
    const images = await getImages()

    const regulatoryAreasWithImages = formattedRegulatoryAreas.map(regulatoryArea => {
      const image = images?.find(
        img =>
          String(img.featureId)?.includes('DASHBOARD_REGULATORY_AREAS') &&
          String(img.featureId).split(':')[1] === String(regulatoryArea.id)
      )

      return {
        ...regulatoryArea,
        image
      }
    })

    const wholeImage = images?.find(img => String(img.featureId)?.includes('WHOLE_DASHBOARD'))

    const { data } = await dispatch(
      dashboardsAPI.endpoints.exportBrief.initiate({
        dashboard,
        image: wholeImage,
        regulatoryAreas: regulatoryAreasWithImages
      })
    )

    if (data) {
      try {
        const content = data?.fileContent
        // Decode base64 string
        const decodedContent = atob(content)

        // Convert the decoded content to a Uint8Array
        const uint8Array = new Uint8Array(decodedContent.length)
        for (let i = 0; i < decodedContent.length; i += 1) {
          uint8Array[i] = decodedContent.charCodeAt(i)
        }

        // Create a Blob from the Uint8Array
        const blob = new Blob([uint8Array], { type: 'application/vnd.oasis.opendocument.text' })

        // Create a temporary link element
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = data.fileName

        // Append the link to the document body and trigger a click event
        document.body.appendChild(link)
        link.click()

        // Remove the link element from the document body
        document.body.removeChild(link)
      } catch (error) {
        // console.log('handleDownload error: ', error)
      }
    }
  }

  return <Button onClick={exportBrief}>Générer fichier éditable</Button>
}
