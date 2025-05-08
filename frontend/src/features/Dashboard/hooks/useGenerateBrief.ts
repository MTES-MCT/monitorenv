import { getAmpsByIds } from '@api/ampsAPI'
import { getControlUnitsByIds } from '@api/controlUnitsAPI'
import { useGetRecentControlsActivityMutation } from '@api/recentActivity'
import { getRegulatoryAreasByIds } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { getVigilanceAreasByIds } from '@api/vigilanceAreasAPI'
import { useImageConverter } from '@components/Form/Images/hook/useImageConverter'
import { renderPDF } from '@features/Dashboard/components/Pdf/renderPdf'
import { useExportImages } from '@features/Dashboard/hooks/useExportImages'
import { RecentActivity } from '@features/RecentActivity/types'
import { getDatesFromFilters } from '@features/RecentActivity/utils'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { useMemo, useState } from 'react'

import { getRecentActivityFilters } from '../components/DashboardForm/slice'

import type { Dashboard } from '@features/Dashboard/types'
import type { GeoJSON } from 'domain/types/GeoJSON'

export function useGenerateBrief(dashboard: Dashboard.Dashboard) {
  const [isLoadingBrief, setIsLoadingBrief] = useState(false)

  const { subThemes, themes } = useGetControlPlans()

  const recentActivityFilters = useAppSelector(state => getRecentActivityFilters(state.dashboardFilters, dashboard.id))
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

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const filters = useAppSelector(state => getRecentActivityFilters(state.dashboardFilters, activeDashboardId))
  const [getRecentControlsActivity] = useGetRecentControlsActivityMutation()

  const { getImages, loading: loadingImages } = useExportImages()
  const attachementImages = useImageConverter(dashboard.images)

  const generateBrief = async () => {
    const startAfterFilter = filters?.startedAfter
    const startBeforeFilter = filters?.startedBefore

    const { startAfter, startBefore } = getDatesFromFilters({
      periodFilter: filters?.periodFilter as RecentActivity.RecentActivityDateRangeEnum,
      startAfterFilter,
      startBeforeFilter
    })

    const recentActivity = await getRecentControlsActivity({
      administrationIds: filters?.administrationIds,
      controlUnitIds: filters?.controlUnitIds,
      geometry: dashboard.geom as GeoJSON.MultiPolygon,
      startedAfter: startAfter,
      startedBefore: startBefore,
      themeIds: filters?.themeIds
    }).unwrap()

    const images = await getImages(recentActivity, dashboard.controlUnitIds)

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
      recentActivity,
      recentActivityFilters,
      regulatoryAreas,
      reportings: Object.values(reportings?.entities ?? []),
      subThemes,
      themes,
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
