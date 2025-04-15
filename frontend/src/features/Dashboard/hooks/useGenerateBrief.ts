import { getAmpsByIds } from '@api/ampsAPI'
import { getControlUnitsByIds } from '@api/controlUnitsAPI'
import { getRegulatoryAreasByIds } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { getVigilanceAreasByIds } from '@api/vigilanceAreasAPI'
import { useImageConverter } from '@components/Form/Images/hook/useImageConverter'
import { renderPDF } from '@features/Dashboard/components/Pdf/renderPdf'
import { useExportImages } from '@features/Dashboard/hooks/useExportImages'
import { useAppSelector } from '@hooks/useAppSelector'
import { useMemo, useState } from 'react'

import type { Dashboard } from '@features/Dashboard/types'

export function useGenerateBrief(dashboard: Dashboard.Dashboard) {
  const [isLoadingBrief, setIsLoadingBrief] = useState(false)

  const controlUnits = useAppSelector(state => getControlUnitsByIds(state, dashboard.controlUnitIds))
  const regulatoryAreas = useAppSelector(state => getRegulatoryAreasByIds(state, dashboard.regulatoryAreaIds))
  const amps = useAppSelector(state => getAmpsByIds(state, dashboard.ampIds))
  const { data: reportings } = useGetReportingsByIdsQuery(dashboard.reportingIds)
  const vigilanceAreas = useAppSelector(state => getVigilanceAreasByIds(state, dashboard.vigilanceAreaIds))

  const [allLinkedAMPIds, allLinkedRegulatoryAreaIds] = useMemo(
    () => [
      Array.from(new Set(vigilanceAreas.flatMap(vigilanceArea => vigilanceArea.linkedAMPs ?? []))),
      Array.from(new Set(vigilanceAreas.flatMap(vigilanceArea => vigilanceArea.linkedRegulatoryAreas ?? [])))
    ],
    [vigilanceAreas]
  )

  const allLinkedRegulatoryAreas = useAppSelector(state => getRegulatoryAreasByIds(state, allLinkedRegulatoryAreaIds))
  const allLinkedAMPs = useAppSelector(state => getAmpsByIds(state, allLinkedAMPIds))

  const { getImages, loading: loadingImages } = useExportImages()
  const attachementImages = useImageConverter(dashboard.images)

  const generateBrief = async () => {
    const images = await getImages()

    return {
      allLinkedAMPs,
      allLinkedRegulatoryAreas,
      amps,
      attachments: {
        images: attachementImages,
        links: dashboard.links
      },
      comments: dashboard.comments,
      controlUnits,
      images,
      name: dashboard.name,
      regulatoryAreas,
      reportings: Object.values(reportings?.entities ?? []),
      updatedAt: dashboard.updatedAt,
      vigilanceAreas
    } as Dashboard.Brief
  }

  const downloadPdf = async (brief: Dashboard.Brief) => {
    setIsLoadingBrief(true)
    const blob = await renderPDF({ brief })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${dashboard.name}.pdf`
    link.click()
    link.remove()
    URL.revokeObjectURL(url)

    setIsLoadingBrief(false)
  }

  return {
    downloadPdf,
    generateBrief,
    isLoadingBrief,
    loadingImages
  }
}
