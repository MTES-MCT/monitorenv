import { useAppSelector } from '@hooks/useAppSelector'
import Highlighter from 'react-highlight-words'

export function HighlightCell({ text }) {
  const searchQuery = useAppSelector(state => state.vigilanceAreaFilters.searchQuery)

  return (
    <Highlighter
      autoEscape
      highlightClassName="highlight"
      searchWords={searchQuery && searchQuery.length > 0 ? searchQuery.split(' ') : []}
      textToHighlight={text ?? '-'}
      title={text}
    />
  )
}
