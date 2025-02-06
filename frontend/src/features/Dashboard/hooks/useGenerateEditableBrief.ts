import { getAmpsByIds } from '@api/ampsAPI'
import { dashboardsAPI } from '@api/dashboardsAPI'
import { useGetRecentControlsActivityMutation } from '@api/recentActivity'
import { getRegulatoryAreasByIds } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { getVigilanceAreasByIds } from '@api/vigilanceAreasAPI'
import { getAMPColorWithAlpha } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryEnvColorWithAlpha } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { getDatesFromFilters } from '@features/RecentActivity/utils'
import { getFormattedReportingId } from '@features/Reportings/utils'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { getVigilanceAreaColorWithAlpha } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { endingOccurenceText, frequencyText } from '@features/VigilanceArea/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { CoordinatesFormat, getLocalizedDayjs, Level, THEME, customDayjs } from '@mtes-mct/monitor-ui'
import { formatCoordinates } from '@utils/coordinates'
import { formatDateLabel } from '@utils/getDateAsLocalizedString'
import { getTitle } from 'domain/entities/layers/utils'
import { ReportingStatusEnum } from 'domain/entities/reporting'
import { vesselTypeLabel } from 'domain/entities/vesselType'
import { useMemo, useState } from 'react'

import { useExportImages } from './useExportImages'
import { getRecentActivityFilters } from '../components/DashboardForm/slice'

import type { Dashboard } from '../types'
import type { RecentActivity } from '@features/RecentActivity/types'
import type { GeoJSON } from 'domain/types/GeoJSON'
import type { Coordinate } from 'ol/coordinate'

export function useGenerateEditableBrief(dashboard: Dashboard.Dashboard) {
  const dispatch = useAppDispatch()
  const [isLoadingBrief, setIsLoadingBrief] = useState(false)

  const { subThemes, themes } = useGetControlPlans()

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const filters = useAppSelector(state => getRecentActivityFilters(state.dashboardFilters, activeDashboardId))
  const [getRecentControlsActivity] = useGetRecentControlsActivityMutation()

  const { getImages } = useExportImages()
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

  const amps = useAppSelector(state => getAmpsByIds(state, dashboard.ampIds))
  const formattedAmps = amps.map(amp => ({
    color: getAMPColorWithAlpha(amp.type, amp.name),
    designation: amp.designation,
    id: amp.id,
    name: getTitle(amp.name),
    refReg: amp.refReg,
    type: amp.type,
    url: amp.urlLegicem
  }))

  const formattedVigilanceAreas = vigilanceAreas.map(vigilanceArea => ({
    color: getVigilanceAreaColorWithAlpha(vigilanceArea.name, vigilanceArea.comments),
    comments: vigilanceArea.comments,
    endDatePeriod: vigilanceArea.endDatePeriod,
    endingOccurenceDate: endingOccurenceText(vigilanceArea.endingCondition, vigilanceArea.computedEndDate),
    frequency: frequencyText(vigilanceArea.frequency),
    id: vigilanceArea.id,
    linkedAMPs: vigilanceArea.linkedAMPs,
    linkedRegulatoryAreas: vigilanceArea.linkedRegulatoryAreas,
    links: vigilanceArea.links,
    name: vigilanceArea.name,
    startDatePeriod: vigilanceArea.startDatePeriod,
    themes: vigilanceArea.themes?.join(', '),
    visibility: VigilanceArea.VisibilityLabel[vigilanceArea?.visibility ?? VigilanceArea.VisibilityLabel.PUBLIC]
  }))

  const { data: reportings } = useGetReportingsByIdsQuery(dashboard.reportingIds)

  const getReportingIconColors = reporting => {
    let stroke

    switch (reporting.reportType) {
      case ReportingStatusEnum.INFRACTION_SUSPICION:
        stroke = THEME.color.maximumRed
        break
      case ReportingStatusEnum.OBSERVATION:
        stroke = THEME.color.blueGray
        break
      default:
        stroke = THEME.color.slateGray
    }

    if (reporting.attachedMission) {
      stroke = THEME.color.mediumSeaGreen
    }

    return stroke
  }
  const formattedReportings = dashboard.reportingIds
    ? Object.values(reportings?.entities ?? []).map(reporting => {
        const localization = formatCoordinates(
          reporting?.geom?.coordinates[0] as Coordinate,
          CoordinatesFormat.DEGREES_MINUTES_SECONDS
        )
          .replace(/\u2032/g, "'")
          .replace(/\u2033/g, '"')

        const targetDetails = reporting.targetDetails.map(target => ({
          ...target,
          externalReferenceNumber: target.externalReferenceNumber ?? '-',
          imo: target.imo ?? '-',
          mmsi: target.mmsi ?? '-',
          operatorName: target.operatorName ?? '-',
          size: target.size ? `${target.size} m` : '-',
          vesselType: target.vesselType ? vesselTypeLabel[target.vesselType] : '-'
        }))

        const dayJsDate = getLocalizedDayjs(reporting.createdAt ?? customDayjs().toISOString())
        const createdAt = `${formatDateLabel(dayJsDate.format('DD MMM YY'))}, ${dayJsDate.format(
          'HH'
        )}h${dayJsDate.format('mm')} (UTC)`

        const iconColor = getReportingIconColors(reporting)

        return {
          createdAt,
          iconColor,
          id: reporting.id,
          isArchived: reporting.isArchived,
          localization,
          reportingId: getFormattedReportingId(reporting.reportingId),
          reportingSources: reporting.reportingSources?.map(source => source.displayedSource).join(', '),
          reportType: reporting.reportType,
          subThemes: reporting.subThemeIds?.map(subThemeid => subThemes[subThemeid]?.subTheme).join(', '),
          targetDetails,
          targetType: reporting.targetType,
          theme: themes[reporting.themeId]?.theme,
          vehicleType: reporting.vehicleType
        }
      })
    : []

  const downloadEditableBrief = async () => {
    setIsLoadingBrief(true)
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

    const ampsWithImages = formattedAmps.map(amp => {
      const image = images?.find(
        img =>
          String(img.featureId)?.includes('DASHBOARD_AMP') && String(img.featureId).split(':')[1] === String(amp.id)
      )

      return {
        ...amp,
        image
      }
    })

    const vigilanceAreasWithImagesAndLinkedLayers = formattedVigilanceAreas.map(vigilanceArea => {
      const filteredAmps = allLinkedAMPs.filter(amp => vigilanceArea.linkedAMPs?.includes(amp.id))
      const filteredRegulatoryAreas = allLinkedRegulatoryAreas.filter(regulatoryArea =>
        vigilanceArea.linkedRegulatoryAreas?.includes(regulatoryArea.id)
      )
      const image = images?.find(
        img =>
          String(img.featureId)?.includes('DASHBOARD_VIGILANCE_AREAS') &&
          String(img.featureId).split(':')[1] === String(vigilanceArea.id)
      )

      return {
        ...vigilanceArea,
        image,
        linkedAMPs: filteredAmps.map(amp => amp.name).join(', '),
        linkedRegulatoryAreas: filteredRegulatoryAreas.map(regulatoryArea => regulatoryArea.entityName).join(', ')
      }
    })

    const wholeImage = images?.find(img => String(img.featureId)?.includes('WHOLE_DASHBOARD'))

    const { data } = await dispatch(
      dashboardsAPI.endpoints.exportBrief.initiate({
        amps: ampsWithImages,
        dashboard,
        image: wholeImage,
        regulatoryAreas: regulatoryAreasWithImages,
        reportings: formattedReportings ?? [],
        vigilanceAreas: vigilanceAreasWithImagesAndLinkedLayers
      })
    )

    if (data) {
      try {
        const content = data?.fileContent
        const decodedContent = atob(content)

        const uint8Array = new Uint8Array(decodedContent.length)
        for (let i = 0; i < decodedContent.length; i += 1) {
          uint8Array[i] = decodedContent.charCodeAt(i)
        }

        const blob = new Blob([uint8Array], { type: 'application/vnd.oasis.opendocument.text' })

        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = data.fileName

        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        setIsLoadingBrief(false)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error generating file:', error)
        dispatch(
          addSideWindowBanner({
            children: 'Une erreur est survenue lors de la génération du fichier. Veuillez réessayer.',
            isClosable: true,
            isFixed: true,
            level: Level.ERROR,
            withAutomaticClosing: true
          })
        )
      }
    }
  }

  return { downloadEditableBrief, isLoadingEditableBrief: isLoadingBrief }
}
