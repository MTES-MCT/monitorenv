package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO

data class ExtractedAreaEntity(
    val inseeCode: String?,
    val reportings: List<ReportingDTO>,
    val regulatoryAreas: List<RegulatoryAreaEntity>,
    val amps: List<AMPEntity>,
    val vigilanceAreas: List<VigilanceAreaEntity>,
)
