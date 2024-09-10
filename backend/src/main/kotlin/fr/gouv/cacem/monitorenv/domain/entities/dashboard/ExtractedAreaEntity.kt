package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity

class ExtractedAreaEntity(
    val inseeCode: String?,
    val reportings: List<ReportingEntity>,
    val regulatoryAreas: List<RegulatoryAreaEntity>,
    val amps: List<AMPEntity>,
    val vigilanceAreas: List<VigilanceAreaEntity>,
)
