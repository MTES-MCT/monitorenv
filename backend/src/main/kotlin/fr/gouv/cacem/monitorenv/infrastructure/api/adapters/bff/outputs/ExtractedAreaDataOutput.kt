package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ExtractedAreaEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.AMPDataOutput.Companion.fromAMPEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.RegulatoryAreaDataOutput.Companion.fromRegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea.VigilanceAreasDataOutput

class ExtractedAreaDataOutput(
    val inseeCode: String?,
    val reportings: List<ReportingDataOutput>,
    val regulatoryAreas: List<RegulatoryAreaDataOutput>,
    val amps: List<AMPDataOutput>,
    val vigilanceAreas: List<VigilanceAreasDataOutput>,
) {
    companion object {
        fun fromExtractAreaEntity(extractedAreaEntity: ExtractedAreaEntity): ExtractedAreaDataOutput {
            return ExtractedAreaDataOutput(
                inseeCode = extractedAreaEntity.inseeCode,
                reportings = extractedAreaEntity.reportings.map { ReportingDataOutput.fromReportingDTO(it) },
                regulatoryAreas = extractedAreaEntity.regulatoryAreas.map { fromRegulatoryAreaEntity(it) },
                amps = extractedAreaEntity.amps.map { fromAMPEntity(it) },
                vigilanceAreas =
                extractedAreaEntity.vigilanceAreas.map {
                    VigilanceAreasDataOutput.fromVigilanceArea(
                        it,
                    )
                },
            )
        }
    }
}
