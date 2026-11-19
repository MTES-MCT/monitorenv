import { useGetPropagationConflictsQuery } from '@api/regulatoryAreasAPI'
import { skipToken } from '@reduxjs/toolkit/query'
import { isEqual } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

import type { RegulatoryArea } from '../types'

export type RegulatoryAreaGroupFields = 'THEMES' | 'TAGS' | 'RESUME' | 'AUTHORIZATION_PERIODS' | 'PROHIBITION_PERIODS'
export type PropagationOption = { enabled: boolean; overwriteExisting?: boolean }
export type Propagation = Partial<Record<RegulatoryAreaGroupFields, PropagationOption>>
export type PropagationConflicts = Partial<
  Record<RegulatoryAreaGroupFields, { regulatoryAreasWithExistingData: number; totalRegulatoryAreas: number }>
>

/** Form value holding the group value of each propagated field */
export const PROPAGATED_FIELD_TO_FORM_KEY: Record<
  RegulatoryAreaGroupFields,
  keyof RegulatoryArea.RegulatoryAreaGroupToApi
> = {
  AUTHORIZATION_PERIODS: 'authorizationPeriods',
  PROHIBITION_PERIODS: 'prohibitionPeriods',
  RESUME: 'resume',
  TAGS: 'tags',
  THEMES: 'themes'
}

const toPropagation = (propagatedFields: RegulatoryAreaGroupFields[] = []): Propagation =>
  Object.fromEntries(propagatedFields.map(field => [field, { enabled: true }]))

const getEnabledFields = (propagation: Propagation) =>
  (Object.keys(propagation) as RegulatoryAreaGroupFields[]).filter(field => propagation[field]?.enabled).sort()

/**
 * @param regulatoryAreaIds ids of the regulatory areas currently in the group
 * @param savedPropagatedFields fields propagated by the saved group
 */
export function usePropagation(regulatoryAreaIds: number[], savedPropagatedFields?: RegulatoryAreaGroupFields[]) {
  const [propagation, setPropagation] = useState<Propagation>(() => toPropagation(savedPropagatedFields))

  // Reset when the group is (re)loaded, e.g. after a save
  useEffect(() => {
    setPropagation(toPropagation(savedPropagatedFields))
  }, [savedPropagatedFields])

  const enabledFields = useMemo(() => getEnabledFields(propagation), [propagation])

  const { data: conflicts = {} } = useGetPropagationConflictsQuery(
    enabledFields.length > 0 && regulatoryAreaIds.length > 0 ? { fields: enabledFields, regulatoryAreaIds } : skipToken,
    { refetchOnMountOrArgChange: true }
  )

  const toggle = (field: RegulatoryAreaGroupFields, enabled: boolean) =>
    setPropagation(p => ({ ...p, [field]: { enabled, overwriteExisting: undefined } }))

  const setOverwrite = (field: RegulatoryAreaGroupFields, overwriteExisting: boolean) =>
    setPropagation(p => ({ ...p, [field]: { enabled: p[field]?.enabled ?? false, overwriteExisting } }))

  /**
   * The "overwrite?" question is asked only when the group value changed
   * and some regulatory areas already have a value that would be overwritten.
   */
  const needsAnswer = (field: RegulatoryAreaGroupFields, hasGroupValueChanged: boolean) =>
    !!propagation[field]?.enabled &&
    hasGroupValueChanged &&
    (conflicts[field]?.regulatoryAreasWithExistingData ?? 0) > 0

  /** The group can't be saved while a question remains unanswered */
  const isValid = (changedFields: RegulatoryAreaGroupFields[]) =>
    enabledFields.every(
      field => !needsAnswer(field, changedFields.includes(field)) || propagation[field]?.overwriteExisting !== undefined
    )

  const isDirty = !isEqual(enabledFields, getEnabledFields(toPropagation(savedPropagatedFields)))

  return { conflicts, isDirty, isValid, needsAnswer, propagation, setOverwrite, toggle }
}

export const getChangedPropagatedFields = (
  values: RegulatoryArea.RegulatoryAreaGroupToApi,
  initialValues: RegulatoryArea.RegulatoryAreaGroupToApi
): RegulatoryAreaGroupFields[] =>
  (Object.keys(PROPAGATED_FIELD_TO_FORM_KEY) as RegulatoryAreaGroupFields[]).filter(
    field => !isEqual(values[PROPAGATED_FIELD_TO_FORM_KEY[field]], initialValues[PROPAGATED_FIELD_TO_FORM_KEY[field]])
  )
