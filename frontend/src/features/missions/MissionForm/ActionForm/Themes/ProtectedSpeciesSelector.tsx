import { FormikMultiSelect } from '@mtes-mct/monitor-ui'

import { protectedSpeciesEnum } from '../../../../../domain/entities/missions'
import { useNewWindow } from '../../../../../ui/NewWindow'

export function ProtectedSpeciesSelector({ name }) {
  const { newWindowContainerRef } = useNewWindow()
  const options = Object.values(protectedSpeciesEnum)?.sort((a, b) => a.label.localeCompare(b.label))

  return (
    <FormikMultiSelect
      key={name}
      baseContainer={newWindowContainerRef.current}
      data-cy="envaction-protected-species-selector"
      isLight
      label="Espèces protégées"
      name={name}
      options={options}
    />
  )
}
