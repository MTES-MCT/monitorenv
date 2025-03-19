package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

data class BooleanDataOutput(
    val value: Boolean,
) {
    companion object {
        fun get(value: Boolean): BooleanDataOutput =
            BooleanDataOutput(
                value,
            )
    }
}
