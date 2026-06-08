import { useGetUnarchivedMissionsTagsQuery } from '@api/missionTagsAPI'
import { getOptionsFromIdAndName, MultiSelect } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useCallback, useMemo } from 'react'

import { type Mission } from '../../../../domain/entities/missions'

export function MissionTagsField() {
  const { setFieldValue, values } = useFormikContext<Mission>()

  const { data: missionTagsEntities } = useGetUnarchivedMissionsTagsQuery(undefined)

  const missionTagsData = useMemo(() => Object.values(missionTagsEntities ?? []), [missionTagsEntities])

  const missionTagOptions = useMemo(() => getOptionsFromIdAndName(missionTagsData), [missionTagsData])

  const updateMissionTags = useCallback(
    missionTagIds => {
      const missionTagsMatching = missionTagsData.filter(missionTag => missionTagIds?.includes(missionTag.id))
      setFieldValue('missionTags', missionTagsMatching)
    },
    [missionTagsData, setFieldValue]
  )

  const missionTagIds = useMemo(() => values?.missionTags?.map(missionTag => missionTag.id) ?? [], [values])

  return (
    <MultiSelect
      label="Étiquette de mission"
      name="missionTags"
      onChange={nextMissionTags => updateMissionTags(nextMissionTags)}
      options={missionTagOptions ?? []}
      value={missionTagIds}
    />
  )
}
