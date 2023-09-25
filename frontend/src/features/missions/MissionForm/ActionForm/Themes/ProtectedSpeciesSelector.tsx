import { MultiSelect, useNewWindow } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'

import { type Mission, protectedSpeciesEnum } from '../../../../../domain/entities/missions'
import { updateProtectedSpecies } from '../../formikUseCases/updateActionThemes'

export function ProtectedSpeciesSelector({ actionIndex, themeIndex }) {
  const [currentProtectedSpeciesField] = useField<string[]>(
    `envActions[${actionIndex}].themes[${themeIndex}].protectedSpecies`
  )
  const { newWindowContainerRef } = useNewWindow()
  const { setFieldValue } = useFormikContext<Mission>()
  const options = Object.values(protectedSpeciesEnum)?.sort((a, b) => a.label.localeCompare(b.label))

  const handleUpdateProtectedSpecies = protectedSpecies => {
    updateProtectedSpecies(setFieldValue)(protectedSpecies, actionIndex, themeIndex)
  }

  return (
    <MultiSelect
      key={`${actionIndex}-${themeIndex}`}
      baseContainer={newWindowContainerRef.current}
      data-cy="envaction-protected-species-selector"
      isLight
      label="Espèces protégées"
      name={`${actionIndex}-${themeIndex}`}
      onChange={handleUpdateProtectedSpecies}
      options={options}
      value={currentProtectedSpeciesField.value}
    />
  )
}
