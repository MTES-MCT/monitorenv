import { NearbyUnits } from '@features/Dashboard/components/Pdf/NearbyUnits'
import { Document, Page, View } from '@react-pdf/renderer'

import { Amps } from './Amps'
import { Attachments } from './Attachments'
import { Cover } from './Layout/Cover'
import { Headings } from './Layout/Headings'
import { RecentActivity } from './RecentActivity'
import { RegulatoryAreas } from './RegulatoryAreas'
import { Reportings } from './Reportings'
import { layoutStyle, registerFonts } from './style'
import { AreaTable } from './Table'
import { VigilanceAreas } from './VigilanceAreas'

import type { Dashboard } from '@features/Dashboard/types'

export type BriefProps = {
  author?: string
  brief: Dashboard.Brief
  description?: string
  isLight: boolean
  title?: string
}

registerFonts()

export function Brief({ author, brief, description, isLight, title }: BriefProps) {
  return (
    <Document author={author} subject={description} title={title}>
      <Page style={layoutStyle.page}>
        <Cover brief={brief} />
      </Page>
      <Page style={layoutStyle.page}>
        <Headings name={brief.name} />
        <View style={layoutStyle.section}>
          <AreaTable
            amps={brief.amps}
            image={brief.images?.find(image => image.featureId === 'WHOLE_DASHBOARD')}
            regulatoryAreas={brief.regulatoryAreas}
            vigilanceAreas={brief.vigilanceAreas}
          />
        </View>
      </Page>
      {brief.recentActivity.length > 0 && (
        <RecentActivity
          briefName={brief.name}
          images={brief.images}
          recentActivity={brief.recentActivity}
          recentActivityControlUnits={brief.recentActivityControlUnits}
          recentActivityFilters={brief.recentActivityFilters}
          selectedControlUnits={brief.selectedControlUnits}
          themes={brief.themes}
        />
      )}
      {brief.nearbyUnits.length > 0 && (
        <Page style={layoutStyle.page}>
          <Headings name={brief.name} />
          <View style={layoutStyle.section}>
            <NearbyUnits nearbyUnits={brief.nearbyUnits} />
          </View>
        </Page>
      )}
      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      {((brief.attachments.images && brief.attachments.images?.length > 0) || brief.attachments.links.length > 0) && (
        <Page style={layoutStyle.page}>
          <Headings name={brief.name} />
          <View style={layoutStyle.section}>
            <Attachments images={brief.attachments.images} links={brief.attachments.links} />
          </View>
        </Page>
      )}
      {brief.reportings.length > 0 && (
        <Page style={layoutStyle.page}>
          <Headings name={brief.name} />
          <View style={layoutStyle.section}>
            <Reportings reportings={brief.reportings} />
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
      {!isLight && (
        <>
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
        </>
      )}
    </Document>
  )
}
