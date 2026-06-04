import { CantDoActionDialog } from '@components/Dialog/CantDoActionDialog'
import { useMemo } from 'react'

import { MissionSourceEnum } from '../../../../domain/entities/missions'

type ExternalActionsModalProps = {
  onClose: () => void
  sources: MissionSourceEnum[]
}

export function ExternalActionsModal({ onClose, sources }: ExternalActionsModalProps) {
  const isCNSP = sources.includes(MissionSourceEnum.MONITORFISH)
  const isRapportNav = sources.includes(MissionSourceEnum.RAPPORT_NAV)

  const sourceText = useMemo(() => {
    if (isCNSP && !isRapportNav) {
      return 'le CNSP'
    }

    if (!isCNSP && isRapportNav) {
      return "l'unité"
    }

    return "le CNSP et l'unité"
  }, [isCNSP, isRapportNav])

  return (
    <CantDoActionDialog
      data-cy="external-actions-modal"
      onClose={onClose}
      text={
        <>
          <p>La mission ne peut pas être supprimée, car elle comporte des événements</p>
          <p>ajoutés par {sourceText}.</p>
        </>
      }
      warningText={
        <>
          <p>Si vous souhaitez tout de même la supprimer, veuillez contacter {sourceText}</p>
          <p>pour qu&apos;{isCNSP && isRapportNav ? 'ils suppriment' : 'il supprime'} d&apos;abord ses événements.</p>
        </>
      }
    />
  )
}
