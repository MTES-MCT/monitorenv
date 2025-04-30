import { useGenerateBrief } from '@features/Dashboard/hooks/useGenerateBrief'
import { useTracking } from '@hooks/useTracking'
import { Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { Dashboard } from '@features/Dashboard/types'

type GeneratePdfButtonProps = {
  dashboard: Dashboard.Dashboard
}

export function GeneratePdfButton({ dashboard }: GeneratePdfButtonProps) {
  const { trackEvent } = useTracking()
  const { downloadPdf, generateBrief, isLoadingBrief, loadingImages } = useGenerateBrief(dashboard)

  const handleDownload = async () => {
    const brief = await generateBrief()
    downloadPdf(brief)
    trackEvent({
      action: 'Téléchargement du brief',
      category: 'TABLEAU DE BORD & BRIEF',
      name: 'Téléchargement du brief'
    })
  }

  const getLoadingText = () => {
    if (loadingImages) {
      return 'Chargement des images'
    }
    if (isLoadingBrief) {
      return 'Chargement du brief'
    }

    return 'Télécharger le brief'
  }

  return (
    <StyledLinkButton
      disabled={isLoadingBrief || loadingImages}
      Icon={isLoadingBrief || loadingImages ? Icon.Reset : Icon.Document}
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
