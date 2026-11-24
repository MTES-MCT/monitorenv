/* eslint-disable @typescript-eslint/dot-notation */
import { useGetPropagationConflictsQuery } from '@api/regulatoryAreasAPI'
import { skipToken } from '@reduxjs/toolkit/query'
import { isEqual } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

import type { RegulatoryArea } from '../types'

export type RegulatoryAreaGroupFields = 'THEMES' | 'TAGS' | 'RESUME' | 'AUTHORIZATION_PERIODS' | 'PROHIBITION_PERIODS'
export type PropagationOption = { enabled: boolean; overwriteExisting?: boolean }
export type Propagation = Partial<Record<RegulatoryAreaGroupFields, PropagationOption>>
export type PropagationConflict = {
  regulatoryAreasWithExistingData: RegulatoryArea.RegulatoryAreaFromAPI[]
  totalRegulatoryAreas: number
}
export type PropagationConflicts = Partial<Record<RegulatoryAreaGroupFields, PropagationConflict>>

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
  (Object.keys(propagation) as RegulatoryAreaGroupFields[]).filter(field => propagation[field]?.enabled)

export function usePropagation(
  regulatoryAreas: RegulatoryArea.RegulatoryAreaFromAPI[],
  savedPropagatedFields?: RegulatoryAreaGroupFields[]
) {
  const [propagation, setPropagation] = useState<Propagation>(() => toPropagation(savedPropagatedFields))

  // Reset when the group is (re)loaded, e.g. after a save
  useEffect(() => {
    setPropagation(toPropagation(savedPropagatedFields))
  }, [savedPropagatedFields])

  const enabledFields = useMemo(() => getEnabledFields(propagation), [propagation])

  /** Fields checked on the group but not saved yet: the only ones for which the "overwrite?" question can be asked */
  const newlyEnabledFields = useMemo(
    () => enabledFields.filter(field => !savedPropagatedFields?.includes(field)),
    [enabledFields, savedPropagatedFields]
  )
  const regulatoryAreaIds = useMemo(() => regulatoryAreas.map(({ id }) => id), [regulatoryAreas])

  const { data: conflicts = {} } = useGetPropagationConflictsQuery(
    newlyEnabledFields.length > 0 && regulatoryAreaIds.length > 0
      ? { fields: newlyEnabledFields, regulatoryAreaIds }
      : skipToken,
    { refetchOnMountOrArgChange: true }
  )

  const toggle = (field: RegulatoryAreaGroupFields, enabled: boolean) =>
    setPropagation(p => ({ ...p, [field]: { enabled, overwriteExisting: undefined } }))

  const setOverwrite = (field: RegulatoryAreaGroupFields, overwriteExisting: boolean) =>
    setPropagation(p => ({ ...p, [field]: { enabled: p[field]?.enabled ?? false, overwriteExisting } }))

  /**
   * The "overwrite?" question is asked only when the field is newly checked on the group
   * and some regulatory areas have their own value that would be overwritten.
   */
  const needsAnswer = (field: RegulatoryAreaGroupFields) =>
    newlyEnabledFields.includes(field) && (conflicts[field]?.regulatoryAreasWithExistingData.length ?? 0) > 0

  const isValid = newlyEnabledFields.every(
    field => !needsAnswer(field) || propagation[field]?.overwriteExisting !== undefined
  )

  const isDirty = !isEqual(enabledFields, getEnabledFields(toPropagation(savedPropagatedFields)))

  return {
    conflicts,
    isDirty,
    isValid,
    needsAnswer,
    propagation,
    setOverwrite,
    toggle
  }
}

export const getChangedPropagatedFields = (
  values: RegulatoryArea.RegulatoryAreaGroupToApi,
  initialValues: RegulatoryArea.RegulatoryAreaGroupToApi
): RegulatoryAreaGroupFields[] =>
  (Object.keys(PROPAGATED_FIELD_TO_FORM_KEY) as RegulatoryAreaGroupFields[]).filter(
    field => !isEqual(values[PROPAGATED_FIELD_TO_FORM_KEY[field]], initialValues[PROPAGATED_FIELD_TO_FORM_KEY[field]])
  )
