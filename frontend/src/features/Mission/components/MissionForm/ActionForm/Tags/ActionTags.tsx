import { useGetTagsQuery } from '@api/tagsAPI'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getTagsAsOptions, parseOptionsToTags } from '@utils/getTagsAsOptions'
import { useField } from 'formik'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import type { TagFromAPI } from 'domain/entities/tags'

type ActionTagsProps = {
  actionIndex: number
}
export function ActionTags({ actionIndex }: ActionTagsProps) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const ref = useRef<HTMLDivElement>(null)
  const lastKeyPressed = useRef<string | null>(null)

  const [currentTags, , helpers] = useField<TagFromAPI[]>(`envActions[${actionIndex}].tags`)

  const { data } = useGetTagsQuery()
  const tagsOptions = useMemo(() => getTagsAsOptions(Object.values(data ?? [])), [data])

  const forceFocus = useCallback(() => {
    const input = ref.current?.querySelector('[role="searchbox"]') as HTMLInputElement
    if (lastKeyPressed.current === 'Backspace' && searchQuery.length > 0) {
      input.focus()
    }
  }, [searchQuery.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      lastKeyPressed.current = e.key
    }
    ref.current?.addEventListener('focusout', forceFocus)
    ref.current?.addEventListener('keydown', handleKeyDown)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref.current?.removeEventListener('focusout', forceFocus)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref.current?.removeEventListener('keydown', handleKeyDown)
    }
  }, [forceFocus])

  const handleSearch = (nextQuery: string) => {
    setSearchQuery(nextQuery)
  }

  return (
    <Wrapper ref={ref} data-cy="envaction-tags-element">
      <CheckTreePicker
        childrenKey="subTags"
        isLight
        label="Tags et sous-tags"
        labelKey="name"
        name={`envActions[${actionIndex}].tags`}
        onChange={option => {
          helpers.setValue(parseOptionsToTags(option) ?? [])
        }}
        onSearch={handleSearch}
        options={tagsOptions}
        renderedChildrenValue="Sous-tags."
        renderedValue="Tags"
        value={getTagsAsOptions(currentTags.value)}
        valueKey="id"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  max-width: 100%;
`
