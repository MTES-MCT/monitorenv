import Highlighter from 'react-highlight-words'

export function HighlightCell({ text }) {
  // TODO(30/10/24): get search query filters to add to `searchWords` when filters are added

  return (
    <Highlighter
      autoEscape
      highlightClassName="highlight"
      searchWords={[]}
      textToHighlight={text ?? '-'}
      title={text}
    />
  )
}
