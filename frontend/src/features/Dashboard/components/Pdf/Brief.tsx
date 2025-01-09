import { Document, Page, View } from '@react-pdf/renderer'

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
          <AreaTable
            amps={brief.amps}
            image={brief.images?.find(image => image.featureId === 'WHOLE_DASHBOARD')}
            regulatoryAreas={brief.regulatoryAreas}
            vigilanceAreas={brief.vigilanceAreas}
          />
        </View>
      </Page>
      {brief.regulatoryAreas.length > 0 && (
        <Page style={layoutStyle.page}>
          <Headings name={brief.name} />
          <View style={layoutStyle.section}>
            <RegulatoryAreas images={brief.images ?? []} regulatoryAreas={brief.regulatoryAreas} />
          </View>
        </Page>
      )}
      {brief.amps.length > 0 && (
        <Page style={layoutStyle.page}>
          <Headings name={brief.name} />
          <View style={layoutStyle.section}>
            <Amps amps={brief.amps} images={brief.images ?? []} />
          </View>
        </Page>
      )}
      {brief.vigilanceAreas.length > 0 && (
        <Page style={layoutStyle.page}>
          <Headings name={brief.name} />
          <View style={layoutStyle.section}>
            <VigilanceAreas
              images={brief.images ?? []}
              linkedAMPs={brief.allLinkedAMPs}
              linkedRegulatoryAreas={brief.allLinkedRegulatoryAreas}
              vigilanceAreas={brief.vigilanceAreas}
            />
          </View>
        </Page>
      )}
      {brief.reportings.length > 0 && (
        <Page style={layoutStyle.page}>
          <Headings name={brief.name} />
          <View style={layoutStyle.section}>
            <Reportings reportings={brief.reportings} subThemes={brief.subThemes} themes={brief.themes} />
          </View>
        </Page>
      )}
    </Document>
  )
}
