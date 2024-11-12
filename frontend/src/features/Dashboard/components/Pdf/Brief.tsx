/* eslint-disable import/no-absolute-path */

// TODO (04/11/2024) : use monitor-ui fonts instead of imported/duplicated ones

import { Document, Page, Text, View } from '@react-pdf/renderer'

import { Amps } from './Amps'
import { ControlUnits } from './ControlUnits'
import { Headings } from './Layout/Headings'
import { RegulatoryAreas } from './RegulatoryAreas'
import { Reportings } from './Reportings'
import { layoutStyle, registerFonts } from './style'
import { AreaTable } from './Table'
import { VigilanceAreas } from './VigilanceAreas'

import type { Dashboard } from '@features/Dashboard/types'

type BriefProps = {
  brief: Dashboard.Brief
}

registerFonts()

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
