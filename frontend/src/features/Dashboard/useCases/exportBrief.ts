import { getAmpsByIds } from '@api/ampsAPI'
import { dashboardsAPI } from '@api/dashboardsAPI'
import { recentActivityAPI } from '@api/recentActivity'
import { getRegulatoryAreasByIds } from '@api/regulatoryLayersAPI'
import { reportingsAPI } from '@api/reportingsAPI'
import { getVigilanceAreasByIds } from '@api/vigilanceAreasAPI'
import { getAMPColorWithAlpha } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryEnvColorWithAlpha } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { getDatesFromFilters } from '@features/RecentActivity/utils'
import { getFormattedReportingId } from '@features/Reportings/utils'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { getVigilanceAreaColorWithAlpha } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { endingOccurenceText, frequencyText } from '@features/VigilanceArea/utils'
import { CoordinatesFormat, customDayjs, getLocalizedDayjs, Level, THEME } from '@mtes-mct/monitor-ui'
import { formatCoordinates } from '@utils/coordinates'
import { formatDateLabel } from '@utils/getDateAsLocalizedString'
import { displayTags } from '@utils/getTagsAsOptions'
import { displaySubThemes, displayThemes } from '@utils/getThemesAsOptions'
import { getTitle } from 'domain/entities/layers/utils'
import { type Reporting, ReportingTypeEnum } from 'domain/entities/reporting'
import { vesselTypeLabel } from 'domain/entities/vesselType'

import { getImage, getMinimap } from '../components/Pdf/utils'
import { Dashboard } from '../types'

import type { NearbyUnit } from '@features/Dashboard/components/DashboardForm/NearbyUnits/types'
import type { ExportImageType } from '@features/Dashboard/hooks/useExportImages'
import type { RecentActivityFilters } from '@features/RecentActivity/slice'
import type { RecentActivity } from '@features/RecentActivity/types'
import type { HomeAppThunk } from '@store/index'
import type { GeoJSON } from 'domain/types/GeoJSON'
import type { Coordinate } from 'ol/coordinate'

type ExportBriefProps = {
  dashboard: Dashboard.Dashboard
  getImages: (
    recentActivity: RecentActivity.RecentControlsActivity[],
    controlUnitIds: number[],
    isLight?: boolean
  ) => Promise<ExportImageType[]> | undefined
  nearbyUnits: NearbyUnit[] | undefined
  recentActivityFilters: RecentActivityFilters | undefined
}
export const exportBrief =
  ({ dashboard, getImages, nearbyUnits, recentActivityFilters }: ExportBriefProps): HomeAppThunk =>
  async (dispatch, getState) => {
    /* RECENT ACTIVITY */
    const startAfterFilter = recentActivityFilters?.startedAfter
    const startBeforeFilter = recentActivityFilters?.startedBefore

    const { startAfter, startBefore } = getDatesFromFilters({
      periodFilter: recentActivityFilters?.periodFilter as RecentActivity.RecentActivityDateRangeEnum,
      startAfterFilter,
      startBeforeFilter
    })
    const { data: recentActivity } = await dispatch(
      recentActivityAPI.endpoints.getRecentControlsActivity.initiate({
        administrationIds: recentActivityFilters?.administrationIds,
        controlUnitIds: recentActivityFilters?.controlUnitIds,
        geometry: dashboard.geom as GeoJSON.MultiPolygon,
        startedAfter: startAfter,
        startedBefore: startBefore,
        themeIds: recentActivityFilters?.themeIds
      })
    )

    const images = await getImages(recentActivity ?? [], dashboard.controlUnitIds, false)

    const wholeImage = images?.find(img => String(img.featureId)?.includes('WHOLE_DASHBOARD'))?.image

    /* VIGILANCE AREAS */
    const vigilanceAreas = getVigilanceAreasByIds(getState(), dashboard.vigilanceAreaIds)
    const [allLinkedAMPIds, allLinkedRegulatoryAreaIds] = [
      Array.from(new Set(vigilanceAreas.flatMap(vigilanceArea => vigilanceArea.linkedAMPs ?? []))),
      Array.from(new Set(vigilanceAreas.flatMap(vigilanceArea => vigilanceArea.linkedRegulatoryAreas ?? [])))
    ]
    const allLinkedAMPs = getAmpsByIds(getState(), allLinkedAMPIds)
    const allLinkedRegulatoryAreas = getRegulatoryAreasByIds(getState(), allLinkedRegulatoryAreaIds)
    const formattedVigilanceAreas = vigilanceAreas.map(vigilanceArea => ({
      color: getVigilanceAreaColorWithAlpha(vigilanceArea.name, vigilanceArea.comments),
      comments: vigilanceArea.comments,
      endDatePeriod: vigilanceArea.endDatePeriod,
      endingOccurenceDate: endingOccurenceText(vigilanceArea.endingCondition, vigilanceArea.computedEndDate),
      frequency: frequencyText(vigilanceArea.frequency),
      id: vigilanceArea.id,
      isAtAllTimes: vigilanceArea.isAtAllTimes,
      linkedAMPs: vigilanceArea.linkedAMPs,
      linkedRegulatoryAreas: vigilanceArea.linkedRegulatoryAreas,
      links: vigilanceArea.links,
      name: vigilanceArea.name,
      startDatePeriod: vigilanceArea.startDatePeriod,
      themes: displayThemes(vigilanceArea.themes),
      visibility: VigilanceArea.VisibilityLabel[vigilanceArea?.visibility ?? VigilanceArea.VisibilityLabel.PUBLIC]
    }))

    const vigilanceAreasWithImagesAndLinkedLayers = formattedVigilanceAreas.map(vigilanceArea => {
      const filteredAmps = allLinkedAMPs.filter(amp => vigilanceArea.linkedAMPs?.includes(amp.id))
      const filteredRegulatoryAreas = allLinkedRegulatoryAreas.filter(regulatoryArea =>
        vigilanceArea.linkedRegulatoryAreas?.includes(regulatoryArea.id)
      )
      const image = getImage(images ?? [], Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS, vigilanceArea.id)
      const minimap = getMinimap(images ?? [], Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS, vigilanceArea.id)

      return {
        ...vigilanceArea,
        image,
        linkedAMPs: filteredAmps.map(amp => amp.name).join(', '),
        linkedRegulatoryAreas: filteredRegulatoryAreas.map(regulatoryArea => regulatoryArea.entityName).join(', '),
        minimap
      }
    })
    /* REGULATORY AREAS */
    const regulatoryAreas = getRegulatoryAreasByIds(getState(), dashboard.regulatoryAreaIds)
    const formattedRegulatoryAreas = regulatoryAreas.map(regulatoryArea => ({
      color: getRegulatoryEnvColorWithAlpha(displayTags(regulatoryArea.tags), regulatoryArea.entityName),
      entityName: getTitle(regulatoryArea.entityName),
      facade: regulatoryArea.facade,
      id: regulatoryArea.id,
      layerName: getTitle(regulatoryArea.layerName),
      refReg: regulatoryArea.refReg,
      themes: displayThemes(regulatoryArea.themes),
      type: regulatoryArea.type,
      url: regulatoryArea.url
    }))
    const regulatoryAreasWithImages = formattedRegulatoryAreas.map(regulatoryArea => {
      const image = getImage(images ?? [], Dashboard.Layer.DASHBOARD_REGULATORY_AREAS, regulatoryArea.id)
      const minimap = getMinimap(images ?? [], Dashboard.Layer.DASHBOARD_REGULATORY_AREAS, regulatoryArea.id)

      return {
        ...regulatoryArea,
        image,
        minimap
      }
    })

    /* AMP */
    const amps = getAmpsByIds(getState(), dashboard.ampIds)
    const formattedAmps = amps.map(amp => ({
      color: getAMPColorWithAlpha(amp.type, amp.name),
      designation: amp.designation,
      id: amp.id,
      name: getTitle(amp.name),
      refReg: amp.refReg,
      type: amp.type,
      url: amp.urlLegicem
    }))
    const ampsWithImages = formattedAmps.map(amp => {
      const image = getImage(images ?? [], Dashboard.Layer.DASHBOARD_AMP, amp.id)
      const minimap = getMinimap(images ?? [], Dashboard.Layer.DASHBOARD_AMP, amp.id)

      return {
        ...amp,
        image,
        minimap
      }
    })

    /* REPORTINGS */
    const { data: reportings } = await dispatch(
      reportingsAPI.endpoints.getReportingsByIds.initiate(dashboard.reportingIds)
    )

    const getReportingIconColors = (reporting: Reporting) => {
      let stroke: string

      switch (reporting.reportType) {
        case ReportingTypeEnum.INFRACTION_SUSPICION:
          stroke = THEME.color.maximumRed
          break
        case ReportingTypeEnum.OBSERVATION:
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
      ? (Object.values(reportings?.entities ?? []) as Reporting[]).map(reporting => {
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
            subThemes: displaySubThemes([reporting.theme]),
            targetDetails,
            targetType: reporting.targetType,
            theme: reporting.theme.name,
            vehicleType: reporting.vehicleType
          }
        })
      : []

    const { data, error } = await dispatch(
      dashboardsAPI.endpoints.exportBrief.initiate({
        amps: ampsWithImages,
        dashboard: {
          ...dashboard,
          id: dashboard.createdAt ? dashboard.id : ''
        },
        image: wholeImage,
        nearbyUnits: nearbyUnits ?? [],
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
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error generating file:', err)
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
    if (error) {
      dispatch(
        addSideWindowBanner({
          children: "Une erreur est survenue lors de l'export du brief. Veuillez réessayer.",
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
