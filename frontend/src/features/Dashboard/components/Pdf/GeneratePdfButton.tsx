import { getAmpsByIds } from '@api/ampsAPI'
import { getControlUnitsByIds } from '@api/controlUnitsAPI'
import { getRegulatoryAreasByIds } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { getVigilanceAreasByIds } from '@api/vigilanceAreasAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { Button, Icon } from '@mtes-mct/monitor-ui'
import { usePDF } from '@react-pdf/renderer'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Brief } from './Brief'

import type { Dashboard } from '@features/Dashboard/types'

type GeneratePdfButtonProps = {
  dashboard: Dashboard.Dashboard
}

export function GeneratePdfButton({ dashboard }: GeneratePdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
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

  const brief: Dashboard.Brief = useMemo(
    () => ({
      allLinkedAMPs,
      allLinkedRegulatoryAreas,
      amps,
      comments: dashboard.comments,
      controlUnits,
      name: dashboard.name,
      regulatoryAreas,
      reportings: Object.values(reportings?.entities ?? []),
      subThemes,
      themes,
      updatedAt: dashboard.updatedAt,
      vigilanceAreas
    }),
    [
      amps,
      dashboard.comments,
      dashboard.name,
      dashboard.updatedAt,
      controlUnits,
      regulatoryAreas,
      reportings?.entities,
      subThemes,
      themes,
      allLinkedAMPs,
      vigilanceAreas,
      allLinkedRegulatoryAreas
    ]
  )

  const [pdf, update] = usePDF({ document: <Brief brief={brief} /> })

  const handleDownload = () => {
    setIsGenerating(true)

    update(<Brief brief={brief} />)
  }

  useEffect(() => {
    if (isGenerating && !pdf.loading && pdf.blob && pdf.url) {
      setIsGenerating(false)

      const link = document.createElement('a')
      link.href = pdf.url
      link.download = `${dashboard.name}.pdf`
      link.click()
    }
  }, [isGenerating, pdf.loading, pdf.blob, pdf.url, dashboard.name])

  return (
    <StyledLinkButton
      $isDisabled={pdf.loading || isGenerating}
      Icon={pdf.loading || isGenerating ? Icon.Reset : Icon.Document}
      onClick={handleDownload}
    >
      {pdf.loading || isGenerating ? 'Chargement du brief' : 'Générer un brief'}
    </StyledLinkButton>
  )
}

const StyledLinkButton = styled(Button)<{ $isDisabled: boolean }>`
  ${p =>
    p.$isDisabled &&
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
