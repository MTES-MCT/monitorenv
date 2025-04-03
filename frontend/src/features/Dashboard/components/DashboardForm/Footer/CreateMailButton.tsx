import { getControlUnitsByIds } from '@api/controlUnitsAPI'
import { useGenerateBrief } from '@features/Dashboard/hooks/useGenerateBrief'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { Dashboard } from '@features/Dashboard/types'

export function CreateMailButton({ dashboard }: { dashboard: Dashboard.Dashboard }) {
  const controlUnits = useAppSelector(state => getControlUnitsByIds(state, dashboard.controlUnitIds))
  const formattedControlUnitNames = controlUnits.map(controlUnit => controlUnit.name).join(', ')
  const formattedControlUnitMails = controlUnits
    .map(controlUnit =>
      controlUnit.controlUnitContacts
        .filter(contact => contact.isEmailSubscriptionContact)
        .map(filteredContact => filteredContact.email)
    )
    .flat()
    .join(', ')

  const { downloadPdf, generateBrief, isLoadingBrief, loadingImages } = useGenerateBrief(dashboard)

  const mailContent = () => {
    const subject = `Briefing CACEM n°${dashboard.id} - ${formattedControlUnitNames}`
    const body = `
    Bonjour,

    Vous trouverez en pièce jointe le briefing CACEM de votre mission (référence : ${dashboard.id}). 
    Cette fonctionnalité est encore en construction : merci de nous faire part de toute suggestion 
    d'amélioration sur son format ou contenu par mail à l'adresse cacem@mer.gouv.fr ou par téléphone 
    au +33 2 90 74 32 55.

    Nous sommes par ailleurs intéressés par toute remontée de renseignement territorial en matière 
    d'environnement marin (signalements ou zones de vigilance) dont vous auriez connaissance, afin 
    de contribuer à une meilleure pertinence des briefings CACEM à destination des autres unités de contrôle.

    Nous vous précisons que ce document ne se substitue pas aux consignes de votre contrôleur opérationnel 
    ou autorité fonctionnelle, et que celui-ci n'a qu'une vocation d'aide à la conduite de votre mission.

    Cordialement,

    Centre d'appui au contrôle de l'environnement marin

    40 Avenue Louis Bougo 56410 ETEL

    Tel : +33 290743255
    `
    const mailtoLink = `mailto:${formattedControlUnitMails}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`

    return mailtoLink
  }

  const handleDownload = async () => {
    if (loadingImages || isLoadingBrief) {
      return
    }
    const brief = await generateBrief()
    downloadPdf(brief)
  }

  return (
    <MailButton
      $disabled={isLoadingBrief || loadingImages}
      href={mailContent()}
      onClick={handleDownload}
      rel="noopener noreferrer"
      target="_blank"
    >
      {isLoadingBrief || loadingImages ? <Icon.Reset /> : <Icon.Send />}
      <span>Partager le brief</span>
    </MailButton>
  )
}

const MailButton = styled.a<{ $disabled: boolean }>`
  align-items: center;
  background-color: ${p => p.theme.color.charcoal};
  border: 1px solid ${p => p.theme.color.charcoal};
  color: ${p => p.theme.color.gainsboro};
  display: flex;
  padding: 6px 12px;
  text-decoration: none;
  > span {
    &:first-child {
      margin-right: 5px;
    }
  }

  &:hover,
  &._hover {
    background-color: ${p => p.theme.color.blueYonder};
    border: 1px solid ${p => p.theme.color.blueYonder};
    color: ${p => p.theme.color.white};
    text-decoration: none;
  }

  &:active,
  &._active,
  &:focus,
  &._focus {
    background-color: ${p => p.theme.color.blueYonder};
    border: 1px solid ${p => p.theme.color.blueYonder};
    color: ${p => p.theme.color.white};
    text-decoration: none;
  }

  ${p =>
    p.$disabled &&
    `@keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    background-color: ${p.theme.color.lightGray};
    border: 1px solid ${p.theme.color.lightGray};
    color: ${p.theme.color.cultured};
    pointer-events: none;
    text-decoration: none;

    > .Element-IconBox > svg {
    animation: spin 2s linear infinite;
    transform-origin: center;
    }`}
`
