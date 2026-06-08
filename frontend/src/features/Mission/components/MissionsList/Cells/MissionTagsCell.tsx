import { Tag, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { Mission } from '../../../../../domain/entities/missions'

export function MissionTagsCell({ mission }: { mission: Mission }) {
  const [firstMissionTag, ...otherMissionTags] = mission.missionTags ?? []

  return (
    <Container>
      {mission.isNoteworthy ? (
        <>
          <Tag backgroundColor={THEME.color.charcoal} color={THEME.color.white}>
            Opération marquante
          </Tag>
          {mission.missionTags?.length !== 0 && (
            <Tag backgroundColor={THEME.color.white}>+{mission.missionTags?.length}</Tag>
          )}
        </>
      ) : (
        <>
          {firstMissionTag && <Tag backgroundColor={THEME.color.white}>{firstMissionTag.name}</Tag>}
          {otherMissionTags.length > 0 && <Tag backgroundColor={THEME.color.white}>+{otherMissionTags.length}</Tag>}
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  gap: 4px;
`
