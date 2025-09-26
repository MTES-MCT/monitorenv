import { getAmpsByIds } from '@api/ampsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useGetRecentControlsActivityMutation } from '@api/recentActivity'
import { getRegulatoryAreasByIds } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { useGetThemesQuery } from '@api/themesAPI'
import { useGetVigilanceAreasByIdsQuery } from '@api/vigilanceAreasAPI'
import { useImageConverter } from '@components/Form/Images/hook/useImageConverter'
import { convertImagesForFront } from '@components/Form/Images/utils'
import { renderPDF } from '@features/Dashboard/components/Pdf/renderPdf'
import { useExportImages } from '@features/Dashboard/hooks/useExportImages'
import { RecentActivity } from '@features/RecentActivity/types'
import { getDatesFromFilters } from '@features/RecentActivity/utils'
import { useAppSelector } from '@hooks/useAppSelector'
import { uniq } from 'lodash-es'
import { useMemo, useState } from 'react'

import { getRecentActivityFilters } from '../components/DashboardForm/slice'

import type { Dashboard } from '@features/Dashboard/types'
import type { GeoJSON } from 'domain/types/GeoJSON'

export function useGenerateBrief(dashboard: Dashboard.Dashboard) {
  const [isLoadingBrief, setIsLoadingBrief] = useState(false)

  const { data: themes } = useGetThemesQuery()

  const recentActivityFilters = useAppSelector(state => getRecentActivityFilters(state.dashboardFilters, dashboard.id))
  const { data: allControlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const selectedControlUnits = allControlUnits?.filter(controlUnit => dashboard.controlUnitIds.includes(controlUnit.id))
  const regulatoryAreas = useAppSelector(state => getRegulatoryAreasByIds(state, dashboard.regulatoryAreaIds))
  const amps = useAppSelector(state => getAmpsByIds(state, dashboard.ampIds))
  const { data: reportings } = useGetReportingsByIdsQuery(dashboard.reportingIds)
  const { data: vigilanceAreas } = useGetVigilanceAreasByIdsQuery(dashboard.vigilanceAreaIds)

  const [allLinkedAMPIds, allLinkedRegulatoryAreaIds] = useMemo(
    () => [
      Array.from(new Set(vigilanceAreas?.flatMap(vigilanceArea => vigilanceArea.linkedAMPs ?? []))),
      Array.from(new Set(vigilanceAreas?.flatMap(vigilanceArea => vigilanceArea.linkedRegulatoryAreas ?? [])))
    ],
    [vigilanceAreas]
  )

  const allLinkedRegulatoryAreas = useAppSelector(state => getRegulatoryAreasByIds(state, allLinkedRegulatoryAreaIds))
  const allLinkedAMPs = useAppSelector(state => getAmpsByIds(state, allLinkedAMPIds))

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const filters = useAppSelector(state => getRecentActivityFilters(state.dashboardFilters, activeDashboardId))
  const selectedNearbyUnits = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.selectedNearbyUnits : []
  )
  const [getRecentControlsActivity] = useGetRecentControlsActivityMutation()

  const { getImages, loading: loadingImages } = useExportImages()
  const attachementImages = useImageConverter(dashboard.images)

  const getVigilanceAreasWithFormattedImages = async () => {
    const formattedVigilancesAreas =
      (await vigilanceAreas?.map(async vigilanceArea => {
        const images = await convertImagesForFront(vigilanceArea.images ?? [], document.body)

        return { ...vigilanceArea, images }
      })) ?? []

    return Promise.all(formattedVigilancesAreas)
  }

  const generateBrief = async ({ isLight = false }: { isLight?: boolean } = {}) => {
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

    const allRecentActivityControlUnitIds = uniq(recentActivity.flatMap(({ controlUnitIds }) => controlUnitIds))
    const filteredRecentActivityControlUnits = allControlUnits?.filter(controlUnit =>
      allRecentActivityControlUnitIds.includes(controlUnit.id)
    )
    const images = await getImages(recentActivity, dashboard.controlUnitIds, isLight)

    const formattedVigilancesAreas = await getVigilanceAreasWithFormattedImages()

    return {
      allLinkedAMPs,
      allLinkedRegulatoryAreas,
      amps: uniq([...amps, ...allLinkedAMPs]),
      attachments: {
        images: attachementImages,
        links: dashboard.links
      },
      comments: dashboard.comments,
      images,
      name: dashboard.name,
      nearbyUnits: selectedNearbyUnits,
      recentActivity,
      recentActivityControlUnits: filteredRecentActivityControlUnits,
      recentActivityFilters,
      regulatoryAreas: uniq([...regulatoryAreas, ...allLinkedRegulatoryAreas]),
      reportings: Object.values(reportings?.entities ?? []),
      selectedControlUnits,
      themes: Object.values(themes ?? []),
      updatedAt: dashboard.updatedAt,
      vigilanceAreas: formattedVigilancesAreas
    } as Dashboard.Brief
  }

  const downloadPdf = async (brief: Dashboard.Brief, isLight: boolean = false) => {
    setIsLoadingBrief(true)
    const blob = await renderPDF({ brief, isLight })
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
