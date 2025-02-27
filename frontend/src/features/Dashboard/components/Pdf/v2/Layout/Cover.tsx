import { customDayjs, THEME } from '@mtes-mct/monitor-ui'
import { Image, Link, StyleSheet, Text, View } from '@react-pdf/renderer'
import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'

import { layoutStyle } from '../style'

import type { Dashboard } from '@features/Dashboard/types'

const footerHeight = 137
const footerPadding = 20
const styles = StyleSheet.create({
  confidential: { ...layoutStyle.italic, fontSize: 9.3, marginBottom: 42 },
  contact: { alignItems: 'center', display: 'flex', flexDirection: 'row', gap: 12 },
  description: {
    fontSize: 13,
    width: '30%'
  },
  descriptionExternal: {
    fontSize: 10.5,
    fontWeight: 'bold',
    width: '30%'
  },
  details: {
    fontSize: 10.5,
    width: '70%'
  },
  detailsExternal: {
    fontSize: 9.3,
    width: '70%'
  },
  footer: {
    bottom: 0,
    height: footerHeight,
    left: 0,
    padding: `${footerPadding} 22`,
    position: 'absolute',
    right: 0
  },
  footerContent: { display: 'flex', flexDirection: 'row', fontSize: 9.3, justifyContent: 'space-between' },
  row: {
    ...layoutStyle.row,
    alignItems: 'flex-start'
  },
  separator: {
    borderBottom: `1 solid ${THEME.color.gunMetal}`,
    height: 1,
    marginBottom: 20,
    marginTop: 20,
    width: '100%'
  },
  separatorXL: {
    borderBottom: `2 solid ${THEME.color.gunMetal}`,
    height: 1,
    marginBottom: 16.9,
    marginTop: 16.9,
    width: '100%'
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 104
  }
})

export function Cover({ brief }: { brief: Dashboard.Brief }) {
  const legicemId = import.meta.env.FRONTEND_LEGICEM_ID
  const legicemPassword = import.meta.env.FRONTEND_LEGICEM_PASSWORD
  const monitorEnvExtId = import.meta.env.FRONTEND_MONITORENVEXT_ID
  const monitorEnvExtPassword = import.meta.env.FRONTEND_MONITORENVEXT_PASSWORD

  return (
    <>
      <Text style={styles.title}>Briefing de mission</Text>
      <View style={styles.separatorXL} />
      <Text style={styles.confidential}>Diffusion limitée aux seules unités/personnes concernées par ce document </Text>
      <View style={{ marginBottom: footerHeight - 2 * footerPadding, position: 'relative' }}>
        <View style={{ gap: 34, height: '100%', justifyContent: 'space-between' }}>
          <View style={{ gap: 34 }}>
            <View style={styles.row}>
              <View style={styles.description}>
                <Text>Unité(s)</Text>
              </View>
              <View style={styles.details}>
                {brief.controlUnits.map(({ administration, id, name }) => (
                  <Text key={id} style={{ fontWeight: 'bold' }}>
                    {name} - {administration.name}
                  </Text>
                ))}
                {brief.controlUnits.length === 0 && (
                  <Text style={{ fontStyle: 'italic' }}>Aucune unité sélectionnée</Text>
                )}
              </View>
            </View>
            <View style={layoutStyle.row}>
              <View style={styles.description}>
                <Text>Zones</Text>
              </View>
              <View style={styles.details}>
                {brief.regulatoryAreas.length > 0 ? (
                  <Text style={{ fontWeight: 'bold' }}>{brief.regulatoryAreas.length} zones réglementaires</Text>
                ) : (
                  <Text style={{ fontStyle: 'italic' }}>Aucune zone réglementaire</Text>
                )}
                {brief.amps.length > 0 ? (
                  <Text style={{ fontWeight: 'bold' }}>{brief.amps.length} aires marines protégées</Text>
                ) : (
                  <Text style={{ fontStyle: 'italic' }}>Aucune aire marine protégée</Text>
                )}
                {brief.vigilanceAreas.length > 0 ? (
                  <Text style={{ fontWeight: 'bold' }}>{brief.vigilanceAreas.length} zones de vigilance</Text>
                ) : (
                  <Text style={{ fontStyle: 'italic' }}>Aucune zone de vigilance</Text>
                )}
              </View>
            </View>
            {brief.reportings.length > 0 && (
              <View style={styles.row}>
                <View style={styles.description}>
                  <Text>Signalements</Text>
                </View>
                <View style={styles.details}>
                  <Text style={{ fontWeight: 'bold' }}>{brief.reportings.length} sélectionnés</Text>
                </View>
              </View>
            )}
            {!!brief.comments && (
              <View style={styles.row}>
                <View style={styles.description}>
                  <Text>Commentaire</Text>
                </View>
                <View style={styles.details}>
                  <Text>{brief.comments}</Text>
                </View>
              </View>
            )}
          </View>
          <View style={{ gap: 21 }} wrap={false}>
            <View style={styles.row}>
              <View style={styles.descriptionExternal}>
                <Text>Légicem</Text>
              </View>
              <View style={[styles.detailsExternal]}>
                <Link href="https://extranet.legicem.metier.developpement-durable.gouv.fr">
                  https://extranet.legicem.metier.developpement-durable.gouv.fr
                </Link>
                <Text style={{ fontWeight: 'medium' }}>
                  ID <Text style={{ fontWeight: 'normal' }}> : {legicemId}</Text>
                </Text>
                <Text style={{ fontWeight: 'medium' }}>
                  Mot de passe <Text style={{ fontWeight: 'normal' }}> : {legicemPassword}</Text>
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.descriptionExternal}>
                <Text>Monitor Ext</Text>
              </View>
              <View style={[styles.detailsExternal]}>
                <Link href="https://monitorenv.din.developpement-durable.gouv.fr/ext">
                  https://monitorenv.din.developpement-durable.gouv.fr/ext
                </Link>
                <Text style={{ fontWeight: 'medium' }}>
                  ID <Text style={{ fontWeight: 'normal' }}> : {monitorEnvExtId}</Text>
                </Text>
                <Text style={{ fontWeight: 'medium' }}>
                  Mot de passe <Text style={{ fontWeight: 'normal' }}> : {monitorEnvExtPassword}</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View fixed style={styles.footer}>
        <View style={styles.separator} />
        <View style={styles.footerContent}>
          <View style={styles.contact}>
            <Image source="logo-CACEM.jpeg" style={{ width: 55 }} />
            <View>
              <Text>02 90 74 32 55</Text>
              <Link href="cacem@mer.gouv.fr">cacem@mer.gouv.fr</Link>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', display: 'flex', flexDirection: 'column' }}>
            <Text>Référence : {brief.name}</Text>
            <Text style={{ marginBottom: 12 }}>
              Édité le {getDateAsLocalizedStringVeryCompact(customDayjs().toISOString(), true)}
            </Text>
            <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
          </View>
        </View>
      </View>
    </>
  )
}
