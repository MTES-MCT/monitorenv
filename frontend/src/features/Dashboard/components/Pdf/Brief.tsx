/* eslint-disable import/no-absolute-path */

// TODO (04/11/2024) : use monitor-ui fonts instead of imported/duplicated ones

import { Document, Image, Page, View } from '@react-pdf/renderer'

import { Amps } from './Amps'
import { Comments } from './Comments'
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
          <Comments comments={brief.comments} />
        </View>
        <View style={layoutStyle.section}>
          <Reportings reportings={brief.reportings} subThemes={brief.subThemes} themes={brief.themes} />
        </View>
        <View style={layoutStyle.section}>
          <AreaTable amps={brief.amps} regulatoryAreas={brief.regulatoryAreas} vigilanceAreas={brief.vigilanceAreas} />
        </View>
        <View style={layoutStyle.section}>
          <RegulatoryAreas regulatoryAreas={brief.regulatoryAreas} />
        </View>
        <View style={layoutStyle.section}>
          <Amps amps={brief.amps} />
        </View>
        <View style={layoutStyle.section}>
          <VigilanceAreas
            linkedAMPs={brief.allLinkedAMPs}
            linkedRegulatoryAreas={brief.allLinkedRegulatoryAreas}
            vigilanceAreas={brief.vigilanceAreas}
          />
        </View>
        {/* eslint-disable-next-line react/no-array-index-key */}
        {brief.images && brief.images.map((image, index) => <Image key={index} src={image} />)}
      </Page>
    </Document>
  )
}
