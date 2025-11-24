import countries from 'i18n-iso-countries'
import Highlighter from 'react-highlight-words'
import styled from 'styled-components'

type VesselSearchItemProps = {
  flag?: string
  immatriculation?: string
  imo?: string
  mmsi?: string
  searchQuery?: string
  vesselName?: string
}

const UNKNOWN = 'Inconnu'

export function VesselSearchItem({ flag, immatriculation, imo, mmsi, searchQuery, vesselName }: VesselSearchItemProps) {
  return (
    <Wrapper>
      <Name $isUnknown={!vesselName}>
        <Flag
          rel="preload"
          src={`${window.location.origin}/flags/${flag ? `${flag.substring(0, 2).toLowerCase()}.svg` : 'unknown.png'}`}
          title={flag ? countries.getName(flag, 'fr') : 'Inconnu'}
        />
        <Highlighter
          autoEscape
          highlightClassName="highlight"
          searchWords={searchQuery ? [searchQuery] : []}
          textToHighlight={vesselName ?? 'NOM INCONNU'}
        />
      </Name>
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

const Name = styled.span<{ $isUnknown?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  ${p => p.$isUnknown && `font-style: italic;`}
`

const Identities = styled.span`
  display: flex;
  color: ${p => p.theme.color.slateGray};
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
