import { getAmpsByIds } from '@api/ampsAPI'
import { getControlUnitsByIds } from '@api/controlUnitsAPI'
import { getRegulatoryAreasByIds } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { getVigilanceAreasByIds } from '@api/vigilanceAreasAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { Button, Icon } from '@mtes-mct/monitor-ui'
import { usePDF } from '@react-pdf/renderer'
import { useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { Brief } from './Brief'

import type { Dashboard } from '@features/Dashboard/types'

type GeneratePdfButtonProps = {
  dashboard: Dashboard.Dashboard
}

export function GeneratePdfButton({ dashboard }: GeneratePdfButtonProps) {
  const { subThemes, themes } = useGetControlPlans()

  const controlUnits = useAppSelector(state => getControlUnitsByIds(state, dashboard.controlUnitIds))

  const regulatoryAreas = useAppSelector(state => getRegulatoryAreasByIds(state, dashboard.regulatoryAreaIds))

  const amps = useAppSelector(state => getAmpsByIds(state, dashboard.ampIds))

  const { data: reportings } = useGetReportingsByIdsQuery(dashboard.reportingIds)

  const vigilanceAreas = useAppSelector(state => getVigilanceAreasByIds(state, dashboard.vigilanceAreaIds))

  const [allLinkedAMPIds, allLinkedRegulatoryAreaIds] = useMemo(
    () => [
      Array.from(new Set(vigilanceAreas.flatMap(vigilanceArea => vigilanceArea.linkedAMPs))),
      Array.from(new Set(vigilanceAreas.flatMap(vigilanceArea => vigilanceArea.linkedRegulatoryAreas)))
    ],
    [vigilanceAreas]
  )

  const allLinkedRegulatoryAreas = useAppSelector(state => getRegulatoryAreasByIds(state, allLinkedRegulatoryAreaIds))

  const allLinkedAMPs = useAppSelector(state => getAmpsByIds(state, allLinkedAMPIds))

  // Mémoriser la structure du brief
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

  useEffect(() => update(<Brief brief={brief} />), [brief, update])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdf.url ?? `${dashboard.name}.pdf`
    link.download = `${dashboard.name}.pdf`
    link.click()
  }

  return (
    <StyledLinkButton Icon={Icon.Download} onClick={handleDownload}>
      Générer un brief
    </StyledLinkButton>
  )
}

const StyledLinkButton = styled(Button)``
