import { Bold } from '@components/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Level, Message } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { getTagsWarningMessageHasBeenShownForActionId, missionFormsActions } from '../slice'

export function TagsWarningMessage({ actionId }: { actionId: string }) {
  const dispatch = useAppDispatch()
  const tagsWarningMessageHasBeenShown = useAppSelector(state =>
    getTagsWarningMessageHasBeenShownForActionId(state.missionForms, actionId)
  )

  const validate = () => {
    dispatch(missionFormsActions.setTagsWarningMessageHasBeenShown({ actionId, hasBeenShown: true }))
  }

  if (!tagsWarningMessageHasBeenShown || tagsWarningMessageHasBeenShown?.hasBeenShown) {
    return null
  }

  return (
    <StyledMessage key={actionId} level={Level.WARNING}>
      <Text>
        <Bold>Attention, des tags sont parfois nécessaires</Bold>
        <p>Exemple : espèces sensibles en pêche, ZPF, espèces protégées, etc.</p>
      </Text>

      <Button accent={Accent.WARNING} isFullWidth onClick={validate}>
        Ok, je vérifie
      </Button>
    </StyledMessage>
  )
}

const StyledMessage = styled(Message)`
  margin-top: 8px;
  position: relative;
  z-index: 10;
`
const Text = styled.div`
  margin-bottom: 16px;
`
