import { useMemo, useState } from 'react'

export type RegulatoryAreaGroupFields = 'THEMES' | 'TAGS' | 'RESUME' | 'AUTHORIZATION_PERIODS' | 'PROHIBITION_PERIODS'
export type PropagationOption = { enabled: boolean; overwriteExisting?: boolean }
// type Conflicts = Partial<Record<RegulatoryAreaGroupFields, { totalZones: number; zonesWithExistingData: number }>>

export type Propagation = Partial<Record<RegulatoryAreaGroupFields, PropagationOption>>
export function usePropagation(/* zoneIds: number[] */) {
  const [propagation, setPropagation] = useState<Propagation>({})

  const enabledFields = useMemo(
    () => (Object.keys(propagation) as RegulatoryAreaGroupFields[]).filter(f => propagation[f]?.enabled),
    [propagation]
  )

  const { data: conflicts = {} } = {} /* useQuery<Conflicts>({
    queryKey: ['propagation-conflicts', zoneIds, enabledFields],
    queryFn: () => api.post('/regulatory-areas/propagation-conflicts', { zoneIds, fields: enabledFields }),
    enabled: enabledFields.length > 0 && zoneIds.length > 0
  })
 */
  const toggle = (field: RegulatoryAreaGroupFields, enabled: boolean) =>
    setPropagation(p => ({ ...p, [field]: { enabled, overwriteExisting: undefined } }))

  const setOverwrite = (field: RegulatoryAreaGroupFields, overwriteExisting: boolean) =>
    setPropagation(p => ({ ...p, [field]: { ...p[field]!, overwriteExisting } }))

  // La question Oui/Non n'est posée que s'il y a vraiment un conflit
  const needsAnswer = (field: RegulatoryAreaGroupFields) =>
    propagation[field]?.enabled && (conflicts[field]?.zonesWithExistingData ?? 0) > 0

  // Le bouton « Créer le groupe » est bloqué tant qu'une question reste sans réponse
  const isValid = enabledFields.every(f => !needsAnswer(f) || propagation[f]?.overwriteExisting !== undefined)

  return { conflicts, isValid, needsAnswer, propagation, setOverwrite, toggle }
}
