import { dashboardActions } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Textarea } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import { Accordion } from '../Accordion'

type CommentsProps = {
  comments: string | undefined
  isExpanded: boolean
  setExpandedAccordion: () => void
}

export function Comments({ comments, isExpanded, setExpandedAccordion }: CommentsProps) {
  const dispatch = useAppDispatch()
  const [commentsValue, setCommentsValue] = useState(comments)

  const onQuery = useDebouncedCallback((value: string | undefined) => {
    dispatch(dashboardActions.setComments(value))
  }, 500)

  const updateComments = (value: string | undefined) => {
    setCommentsValue(value)
    onQuery(value)
  }

  return (
    <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Commentaires">
      <StyledTextarea
        isLabelHidden
        label="Commentaires"
        name="comments"
        onChange={updateComments}
        value={commentsValue}
      />
    </Accordion>
  )
}
const StyledTextarea = styled(Textarea)`
  padding: 16px 24px;
`
