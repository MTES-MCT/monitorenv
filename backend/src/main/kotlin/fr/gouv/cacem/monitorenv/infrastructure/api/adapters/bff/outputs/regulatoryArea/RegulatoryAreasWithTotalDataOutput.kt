package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea

data class RegulatoryAreasWithTotalDataOutput(
    val totalCount: Long,
    val regulatoryAreasByLayer: List<RegulatoryAreasDataOutput>,
)
