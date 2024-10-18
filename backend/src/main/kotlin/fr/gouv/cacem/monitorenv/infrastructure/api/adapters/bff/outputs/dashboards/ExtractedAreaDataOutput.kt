package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ExtractedAreaEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.AMPDataOutput.Companion.fromAMPEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.RegulatoryAreaDataOutput.Companion.fromRegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea.VigilanceAreasDataOutput

class ExtractedAreaDataOutput(
    val inseeCode: String?,
    val reportings: List<Int>,
    val regulatoryAreas: List<Int>,
    val amps: List<Int>,
    val vigilanceAreas: List<Int>,
) {
    companion object {
        fun fromExtractAreaEntity(extractedAreaEntity: ExtractedAreaEntity): ExtractedAreaDataOutput {
            return ExtractedAreaDataOutput(
                inseeCode = extractedAreaEntity.inseeCode,
                reportings = extractedAreaEntity.reportings.map { ReportingDataOutput.fromReportingDTO(it).id },
                regulatoryAreas = extractedAreaEntity.regulatoryAreas.map { fromRegulatoryAreaEntity(it).id },
                amps = extractedAreaEntity.amps.map { fromAMPEntity(it).id },
                vigilanceAreas =
                    extractedAreaEntity.vigilanceAreas.mapNotNull {
                        VigilanceAreasDataOutput.fromVigilanceArea(
                            it,
                        ).id
                    },
            )
        }
    }
}
