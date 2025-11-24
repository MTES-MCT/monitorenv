import { Accent, Dropdown, Icon } from '@mtes-mct/monitor-ui'
import { getColorWithAlpha } from '@utils/utils'
import styled from 'styled-components'

export enum SearchType {
  PLACES = 'Lieux',
  VESSELS = 'Navires'
}

type SearchSwitcherProps = {
  onChange: (value: SearchType) => void
  searchType: SearchType
}

export function SearchSwitcher({ onChange, searchType }: SearchSwitcherProps) {
  const options = Object.values(SearchType)

  return (
    <StyledDropdown accent={Accent.TERTIARY} Icon={Icon.Chevron} title={searchType}>
      {options.map((option, index) => (
        <Dropdown.Item
          /* eslint-disable-next-line react/no-array-index-key */
          key={index}
          onClick={() => {
            onChange(option)
          }}
        >
          {option}
        </Dropdown.Item>
      ))}
    </StyledDropdown>
  )
}

const StyledDropdown = styled(Dropdown)`
  background: ${p => p.theme.color.white};
  box-shadow: 6px 3px 6px ${p => getColorWithAlpha(p.theme.color.slateGray, 0.25)};

  button {
    height: 40px;

    > span {
      color: ${p => p.theme.color.slateGray};
    }
  }

  ul {
    text-align: center;
    width: 100%;
  }
`
