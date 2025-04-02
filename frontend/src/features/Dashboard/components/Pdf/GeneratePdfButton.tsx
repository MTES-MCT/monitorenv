import { getAmpsByIds } from '@api/ampsAPI'
import { getControlUnitsByIds } from '@api/controlUnitsAPI'
import { getRegulatoryAreasByIds } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { getVigilanceAreasByIds } from '@api/vigilanceAreasAPI'
import { useImageConverter } from '@components/Form/Images/hook/useImageConverter'
import { useExportImages } from '@features/Dashboard/hooks/useExportImages'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { Button, Icon } from '@mtes-mct/monitor-ui'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { renderPDF } from './renderPdf'

import type { Dashboard } from '@features/Dashboard/types'

type GeneratePdfButtonProps = {
  dashboard: Dashboard.Dashboard
}

export function GeneratePdfButton({ dashboard }: GeneratePdfButtonProps) {
  const [isLoadingBrief, setIsLoadingBrief] = useState(false)

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

  const { getImages, loading } = useExportImages()

  const attachementImages = useImageConverter(dashboard.images)

  const handleDownload = async () => {
    const images = await getImages()

    const brief: Dashboard.Brief = {
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
      subThemes,
      themes,
      updatedAt: dashboard.updatedAt,
      vigilanceAreas
    }
    download(brief)
  }

  const download = (brief: Dashboard.Brief) => {
    const renderPdf = async () => {
      setIsLoadingBrief(true)

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
      setIsLoadingBrief(false)
    }

    renderPdf()
  }

  const getLoadingText = () => {
    if (loading) {
      return 'Chargement des images'
    }
    if (isLoadingBrief) {
      return 'Chargement du brief'
    }

    return 'Télécharger le brief'
  }

  return (
    <StyledLinkButton
      disabled={isLoadingBrief || loading}
      Icon={isLoadingBrief || loading ? Icon.Reset : Icon.Document}
      onClick={handleDownload}
    >
      {getLoadingText()}
    </StyledLinkButton>
  )
}

export const StyledLinkButton = styled(Button)<{ disabled: boolean }>`
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
