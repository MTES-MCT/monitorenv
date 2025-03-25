import { getRegulatoryAreasByIds } from '@api/regulatoryLayersAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { Button } from '@mtes-mct/monitor-ui'
import { getTitle } from 'domain/entities/layers/utils'
import JSZip from 'jszip'
import { groupBy } from 'lodash'
import { create } from 'xmlbuilder2'

import type { Dashboard } from '@features/Dashboard/types'

export function GenerateEditableDocButton({ dashboard }: { dashboard: Dashboard.Dashboard }) {
  const regulatoryAreas = useAppSelector(state => getRegulatoryAreasByIds(state, dashboard.regulatoryAreaIds))
  const groupedRegulatoryAreas = groupBy(
    [...regulatoryAreas].sort((a, b) => a.layerName.localeCompare(b.layerName)),
    regulatory => regulatory.layerName
  )

  const generateDocument = async () => {
    const zip = new JSZip()

    zip.file('mimetype', 'application/vnd.oasis.opendocument.text', { compression: 'STORE' })

    const contentXml = create({ encoding: 'UTF-8', version: '1.0' })
      .ele('office:document-content', {
        'office:version': '1.2',
        'xmlns:fo': 'urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0',
        'xmlns:office': 'urn:oasis:names:tc:opendocument:xmlns:office:1.0',
        'xmlns:style': 'urn:oasis:names:tc:opendocument:xmlns:style:1.0',
        'xmlns:table': 'urn:oasis:names:tc:opendocument:xmlns:table:1.0',
        'xmlns:text': 'urn:oasis:names:tc:opendocument:xmlns:text:1.0'
      })
      .ele('office:automatic-styles')
      .ele('style:style', { 'style:family': 'paragraph', 'style:name': 'boldStyle' })
      .ele('style:text-properties', { 'fo:font-weight': 'bold' })
      .up()
      .up()
      .ele('style:style', { 'style:family': 'table-cell', 'style:name': 'regulatoryAreas' })
      .ele('style:table-cell-properties', { 'fo:background-color': '#8CC3C0' })
      .up()
      .up()
      .up()
      .ele('office:body')
      .ele('office:text')

    // Création du tableau
    const table = contentXml.ele('table:table', { 'table:name': 'ZonesTable' })

    const titleRow = table.ele('table:table-row', { 'table:style-name': 'regulatoryAreas' })
    titleRow.ele('table:table-cell').ele('text:p').txt('Zones réglementaires')
    // Lignes des sous-éléments
    Object.entries(groupedRegulatoryAreas).forEach(([groupName, layers]) => {
      const groupNameRow = table.ele('table:table-row')
      groupNameRow.ele('table:table-cell').ele('text:p', { 'text:style-name': 'boldStyle' }).txt(groupName)

      layers.forEach(layer => {
        const layerNameRow = table.ele('table:table-row')
        layerNameRow.ele('table:table-cell').ele('text:p').txt(getTitle(layer.entityName))
      })
    })

    const finalXml = contentXml.end({ prettyPrint: true })
    zip.file('mimetype', 'application/vnd.oasis.opendocument.text')
    zip.file('content.xml', finalXml)
    // Le fichier META-INF/manifest.xml est requis pour les documents ODF valides
    const metaInfFolder = zip.folder('META-INF')
    if (metaInfFolder) {
      metaInfFolder.file(
        'manifest.xml',
        `
      <manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0">
        <manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="application/vnd.oasis.opendocument.text"/>
        <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
      </manifest:manifest>
      `
      )
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'document.odt'
    link.click()
  }

  return <Button onClick={generateDocument}>Créer document éditable</Button>
}
