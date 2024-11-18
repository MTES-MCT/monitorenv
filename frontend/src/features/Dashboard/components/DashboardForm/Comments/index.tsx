import { dashboardActions } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Textarea } from '@mtes-mct/monitor-ui'
import { debounce } from 'lodash'
import { forwardRef, useState } from 'react'
import styled from 'styled-components'

import { Accordion } from '../Accordion'

type CommentsProps = {
  comments: string | undefined
  dashboardKey: string
  isExpanded: boolean
  setExpandedAccordion: () => void
}

export const Comments = forwardRef<HTMLDivElement, CommentsProps>(
  ({ comments, dashboardKey, isExpanded, setExpandedAccordion }, ref) => {
    const dispatch = useAppDispatch()
    const [commentsValue, setCommentsValue] = useState(comments)

    const onQuery = debounce((value: string | undefined) => {
      dispatch(dashboardActions.setComments({ comments: value, key: dashboardKey }))
    }, 500)

    const updateComments = (value: string | undefined) => {
      setCommentsValue(value)
      onQuery(value)
    }

    return (
      <Accordion
        isExpanded={isExpanded}
        setExpandedAccordion={setExpandedAccordion}
        title="Commentaires"
        titleRef={ref}
      >
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
)
const StyledTextarea = styled(Textarea)`
  padding: 16px 24px;
`
