package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.amps

data class AmpByIdsDataInput(
    val ids: List<Int>,
    val axis: String,
)
