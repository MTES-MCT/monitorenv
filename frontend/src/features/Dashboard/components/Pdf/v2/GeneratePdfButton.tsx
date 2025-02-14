import { getAmpsByIds } from '@api/ampsAPI'
import { getControlUnitsByIds } from '@api/controlUnitsAPI'
import { getRegulatoryAreasByIds } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { getVigilanceAreasByIds } from '@api/vigilanceAreasAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { Button, Icon } from '@mtes-mct/monitor-ui'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useExportImages } from '../../../hooks/useExportImages'
import { renderPDF } from '../renderPdf'

import type { Dashboard } from '@features/Dashboard/types'

type GeneratePdfButtonProps = {
  dashboard: Dashboard.Dashboard
}

export function GeneratePdfButton({ dashboard }: GeneratePdfButtonProps) {
  const [shouldTriggerExport, setShouldTriggerExport] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { subThemes, themes } = useGetControlPlans()

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

  const { images, loading } = useExportImages({ triggerExport: shouldTriggerExport })

  const brief: Dashboard.Brief = useMemo(
    () => ({
      allLinkedAMPs,
      allLinkedRegulatoryAreas,
      amps,
      comments: dashboard.comments,
      controlUnits,
      images,
      name: dashboard.name,
      regulatoryAreas,
      reportings: Object.values(reportings?.entities ?? []),
      subThemes,
      themes,
      updatedAt: dashboard.updatedAt,
      vigilanceAreas
    }),
    [
      allLinkedAMPs,
      allLinkedRegulatoryAreas,
      amps,
      dashboard.comments,
      dashboard.name,
      dashboard.updatedAt,
      controlUnits,
      images,
      regulatoryAreas,
      reportings?.entities,
      subThemes,
      themes,
      vigilanceAreas
    ]
  )

  const handleDownload = async () => {
    setShouldTriggerExport(true)
    setIsLoading(true)
  }

  useEffect(() => {
    const renderPdf = async () => {
      if (brief.images && !loading && shouldTriggerExport) {
        setIsOpening(true)

        const blob = await renderPDF({ brief })
        const url = URL.createObjectURL(blob)

        if (url) {
          const link = document.createElement('a')
          link.href = url
          link.download = `${dashboard.name}.pdf`
          link.click()
          link.remove()
          URL.revokeObjectURL(url)
        }
        setShouldTriggerExport(false)
        setIsOpening(false)
        setIsLoading(false)
      }
    }
    renderPdf()
  }, [brief, dashboard.name, loading, shouldTriggerExport])

  const getLoadingText = () => {
    if (loading) {
      return 'Chargement des images'
    }
    if (isOpening) {
      return 'Chargement du brief'
    }

    return 'Générer un brief'
  }

  return (
    <>
      <StyledLinkButton disabled={isLoading} Icon={isLoading ? Icon.Reset : Icon.Document} onClick={handleDownload}>
        {getLoadingText()}
      </StyledLinkButton>
    </>
  )
}

const StyledLinkButton = styled(Button)<{ disabled: boolean }>`
  ${p =>
    p.disabled &&
    `@keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  > .Element-IconBox > svg {
    animation: spin 2s linear infinite;
    transform-origin: center;
  }`}
`
