import { dashboardActions } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Textarea } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { Accordion } from '../Accordion'

type CommentsProps = {
  comments: string | undefined
  isExpanded: boolean
  setExpandedAccordion: () => void
}

export function Comments({ comments, isExpanded, setExpandedAccordion }: CommentsProps) {
  const dispatch = useAppDispatch()

  const updateComments = (value: string | undefined) => {
    dispatch(dashboardActions.setComments(value))
  }

  return (
    <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Commentaires">
      <StyledTextarea isLabelHidden label="Commentaires" name="comments" onChange={updateComments} value={comments} />
    </Accordion>
  )
}
const StyledTextarea = styled(Textarea)`
  padding: 16px 24px;
`
