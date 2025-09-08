import { Size, TextInput } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function SearchInput({ children, globalSearchText, placeholder, setGlobalSearchText }) {
  return (
    <SearchHeader>
      <StyledTextInput
        isLabelHidden
        isLight
        isSearchInput
        label={placeholder}
        name={placeholder}
        onChange={setGlobalSearchText}
        placeholder={placeholder}
        size={Size.LARGE}
        value={globalSearchText}
      />
      {children}
    </SearchHeader>
  )
}

const SearchHeader = styled.div`
  display: flex;
  width: 400px;
`
const StyledTextInput = styled(TextInput)`
  width: 310px;

  > div > input {
    height: 42px;
  }
`
