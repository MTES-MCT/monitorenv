/* eslint-disable import/no-absolute-path */

// TODO (04/11/2024) : use monitor-ui fonts instead of imported/duplicated ones

import MarianeBold from '/fonts/Marianne-Bold.woff2?url'
import MarianeBoldItalic from '/fonts/Marianne-Bold_Italic.woff2?url'
import MarianeLight from '/fonts/Marianne-Light.woff2?url'
import MarianeMedium from '/fonts/Marianne-Medium.woff2?url'
import MarianeRegular from '/fonts/Marianne-Regular.woff2?url'
import MarianeRegularItalic from '/fonts/Marianne-Regular_Italic.woff2?url'

import { Document, Font, Page, Text, View } from '@react-pdf/renderer'

import { ControlUnits } from './ControlUnits'
import { Headings } from './Layout/Headings'
import { Reportings } from './Reportings'
import { layoutStyle } from './style'

import type { Dashboard } from '@features/Dashboard/types'

import { Amps } from './Amps'
import { RegulatoryAreas } from './RegulatoryAreas'
import { AreaTable } from './Table'
import { VigilanceAreas } from './VigilanceAreas'

// Create styles
Font.register({
  family: 'Mariane',
  fontWeight: 'bold',
  src: MarianeBold
})
Font.register({
  family: 'Mariane',
  fontWeight: 'normal',
  src: MarianeRegular
})
Font.register({
  family: 'Mariane',
  fontWeight: 'medium',
  src: MarianeMedium
})
Font.register({
  family: 'Mariane',
  fontWeight: 'light',
  src: MarianeLight
})
Font.register({
  family: 'Mariane',
  fontStyle: 'italic',
  fontWeight: 'bold',
  src: MarianeBoldItalic
})
Font.register({
  family: 'Mariane',
  fontStyle: 'italic',
  fontWeight: 'normal',
  src: MarianeRegularItalic
})

type BriefProps = {
  brief: Dashboard.Brief
}

export function Brief({ brief }: BriefProps) {
  return (
    <Document>
      <Page style={layoutStyle.page}>
        <Headings name={brief.name} />
        <View style={layoutStyle.section}>
          <ControlUnits controlUnits={brief.controlUnits} />
        </View>
        <View style={layoutStyle.section}>
          <Text style={layoutStyle.title}>Commentaires</Text>
          <Text style={layoutStyle.comments}>{brief.comments}</Text>
        </View>
        <View style={layoutStyle.section}>
          <Reportings reportings={brief.reportings} subThemes={brief.subThemes} themes={brief.themes} />
        </View>
        <View style={layoutStyle.section}>
          <AreaTable amps={brief.amps} regulatoryAreas={brief.regulatoryAreas} vigilanceAreas={brief.vigilanceAreas} />
        </View>
        <View style={layoutStyle.section} wrap={false}>
          <RegulatoryAreas regulatoryAreas={brief.regulatoryAreas} />
        </View>
        <View style={layoutStyle.section} wrap={false}>
          <Amps amps={brief.amps} />
        </View>
        <View style={layoutStyle.section} wrap={false}>
          <VigilanceAreas
            linkedAMPs={brief.allLinkedAMPs}
            linkedRegulatoryAreas={brief.allLinkedRegulatoryAreas}
            vigilanceAreas={brief.vigilanceAreas}
          />
        </View>
      </Page>
    </Document>
  )
}
