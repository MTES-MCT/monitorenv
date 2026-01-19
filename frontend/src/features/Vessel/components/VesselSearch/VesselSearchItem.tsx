import { Bold } from '@components/style'
import { Tooltip } from '@components/Tooltip'
import { Vessel } from '@features/Vessel/types'
import { Icon } from '@mtes-mct/monitor-ui'
import countries from 'i18n-iso-countries'
import Highlighter from 'react-highlight-words'
import styled from 'styled-components'

type VesselSearchItemProps = {
  category?: string
  flag?: string
  immatriculation?: string
  imo?: string
  isSideWindow: boolean
  mmsi?: string
  searchQuery?: string
  vesselName?: string
}

const UNKNOWN = 'Inconnu'

export function VesselSearchItem({
  category,
  flag,
  immatriculation,
  imo,
  isSideWindow,
  mmsi,
  searchQuery,
  vesselName
}: VesselSearchItemProps) {
  return (
    <Wrapper>
      <Header>
        <Name $isUnknown={!vesselName}>
          <Flag
            rel="preload"
            src={`${window.location.origin}/flags/${
              flag ? `${flag.substring(0, 2).toLowerCase()}.svg` : 'unknown.png'
            }`}
            title={flag ? countries.getName(flag, 'fr') : 'Inconnu'}
          />
          <Highlighter
            autoEscape
            highlightClassName="highlight"
            searchWords={searchQuery ? [searchQuery] : []}
            textToHighlight={vesselName ?? 'NOM INCONNU'}
          />
        </Name>

        {category && (
          <Category
            Icon={category === 'PRO' ? Icon.VesselPro : Icon.VesselLeisure}
            isSideWindow={isSideWindow}
            orientation="BOTTOM_LEFT"
          >
            <span>
              <Bold>Catégorie</Bold> : {Vessel.CategoryLabel[category]}
            </span>
          </Category>
        )}
      </Header>
      <Identities>
        <span>
          <Identity
            $isUnknown={!mmsi}
            autoEscape
            highlightClassName="highlight"
            searchWords={searchQuery ? [searchQuery] : []}
            textToHighlight={mmsi || UNKNOWN}
          />{' '}
          <Description>(MMSI)</Description>
        </span>
        <span>
          <Identity
            $isUnknown={!immatriculation}
            autoEscape
            highlightClassName="highlight"
            searchWords={searchQuery ? [searchQuery] : []}
            textToHighlight={immatriculation || UNKNOWN}
          />{' '}
          <Description>(Immat.)</Description>
        </span>
        <span>
          <Identity
            $isUnknown={!imo}
            autoEscape
            highlightClassName="highlight"
            searchWords={searchQuery ? [searchQuery] : []}
            textToHighlight={imo || UNKNOWN}
          />{' '}
          <Description>(IMO)</Description>
        </span>
      </Identities>
    </Wrapper>
  )
}

export const Flag = styled.img<{
  rel?: 'preload'
}>`
  font-size: 25px;
  width: 26px;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`

const Name = styled.span<{ $isUnknown?: boolean }>`
  align-items: center;
  display: flex;
  ${p => p.$isUnknown && `font-style: italic;`}
  font-weight: 500;
  gap: 8px;
`

const Identities = styled.span`
  color: ${p => p.theme.color.slateGray};
  display: flex;
  justify-content: space-between;
`

const Identity = styled(Highlighter)<{ $isUnknown?: boolean }>`
  ${p => p.$isUnknown && `font-style: italic;`}
  font-weight: 400;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 5px;
`
const Description = styled.span`
  font-weight: 300;
`

const Category = styled(Tooltip)`
  font-size: 12px;
  white-space: nowrap;
  z-index: 99999;
`
