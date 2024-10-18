package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ExtractedAreaEntity

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
                reportings = extractedAreaEntity.reportings,
                regulatoryAreas = extractedAreaEntity.regulatoryAreas,
                amps = extractedAreaEntity.amps,
                vigilanceAreas = extractedAreaEntity.vigilanceAreas,
            )
        }
    }
}
