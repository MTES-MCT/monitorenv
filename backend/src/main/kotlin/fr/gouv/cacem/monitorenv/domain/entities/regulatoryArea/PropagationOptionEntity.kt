package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

/**
 * @param enabled the group value is applied by default to the regulatory areas of the group (current and future ones)
 * @param overwriteExisting answer to "should the group value overwrite the current values of the regulatory areas?".
 * `null` when the question was not asked: the value is then copied only if no regulatory area holds data yet.
 */
data class PropagationOptionEntity(
    val enabled: Boolean,
    val overwriteExisting: Boolean? = null,
)
