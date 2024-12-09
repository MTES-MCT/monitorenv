import { dashboardActions } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Textarea } from '@mtes-mct/monitor-ui'
import { debounce } from 'lodash'
import { forwardRef, useCallback, useMemo, useState } from 'react'
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

    const onQuery = useMemo(
      () =>
        debounce((value: string | undefined) => {
          dispatch(dashboardActions.setComments({ comments: value, key: dashboardKey }))
        }, 200),
      [dashboardKey, dispatch]
    )

    const updateComments = useCallback(
      (value: string | undefined) => {
        setCommentsValue(value)
        onQuery(value)
      },
      [onQuery]
    )

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
