package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryAreas

data class RegulatoryAreasWithTotalDataOutput(
    val totalCount: Long,
    val regulatoryAreasByLayer: List<RegulatoryAreasDataOutput>,
)
