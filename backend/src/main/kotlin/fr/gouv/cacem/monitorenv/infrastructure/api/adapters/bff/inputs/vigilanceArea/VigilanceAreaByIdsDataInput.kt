package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea

data class VigilanceAreaByIdsDataInput(
    val ids: List<Int>,
    val axis: String,
)
