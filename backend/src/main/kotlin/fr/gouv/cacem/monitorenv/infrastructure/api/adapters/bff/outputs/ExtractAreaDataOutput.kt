package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ExtractedAreaEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.AMPDataOutput.Companion.fromAMPEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.RegulatoryAreaDataOutput.Companion.fromRegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea.VigilanceAreaDataOutput

class ExtractAreaDataOutput(
    val inseeCode: String?,
    val reportings: List<ReportingDataOutput>,
    val regulatoryAreas: List<RegulatoryAreaDataOutput>,
    val amps: List<AMPDataOutput>,
    val vigilanceAreas: List<VigilanceAreaDataOutput>,
) {
    companion object {
        fun fromExtractAreaEntity(extractedAreaEntity: ExtractedAreaEntity): ExtractAreaDataOutput {
            return ExtractAreaDataOutput(
                inseeCode = extractedAreaEntity.inseeCode,
                reportings = extractedAreaEntity.reportings.map { ReportingDataOutput.fromReportingDTO(it) },
                regulatoryAreas = extractedAreaEntity.regulatoryAreas.map { fromRegulatoryAreaEntity(it) },
                amps = extractedAreaEntity.amps.map { fromAMPEntity(it) },
                vigilanceAreas = extractedAreaEntity.vigilanceAreas.map { VigilanceAreaDataOutput.fromVigilanceArea(it) },
            )
        }
    }
}
