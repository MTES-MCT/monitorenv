import { Localisation } from '@features/RegulatoryArea/components/RegulatoryAreaForm/Localisation'
import { useState } from 'react'

import { Identification } from './Identification'
import { type MainRefReg, RegulatoryTexts } from './RegulatoryTexts'

export function FormContent({ isEditing }: { isEditing: boolean }) {
  const [editingMainRefReg, setEditingMainRefReg] = useState<MainRefReg | undefined>(undefined)

  return (
    <>
      <Identification />
      <Localisation isEditing={isEditing} onChangeRefReg={setEditingMainRefReg} />
      <RegulatoryTexts editingMainRefReg={editingMainRefReg} onChangeRefReg={setEditingMainRefReg} />
    </>
  )
}
