package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea

data class RegulatoryAreaByIdsDataInput(
    val ids: List<Int>,
    val axis: String,
)
