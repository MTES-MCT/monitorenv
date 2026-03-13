import { RegulatoryAreasPanel } from '@features/RegulatoryArea/components/RegulatoryAreaPanel'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useCallback } from 'react'

import { closeMetadataPanel } from '../slice'

export function RegulatoryMetadata() {
  const dispatch = useAppDispatch()
  const { metadataLayerId, metadataPanelIsOpen } = useAppSelector(state => state.layersMetadata)

  const onCloseIconClicked = useCallback(() => {
    dispatch(closeMetadataPanel())
  }, [dispatch])

  return metadataPanelIsOpen && <RegulatoryAreasPanel layerId={Number(metadataLayerId)} onClose={onCloseIconClicked} />
}
