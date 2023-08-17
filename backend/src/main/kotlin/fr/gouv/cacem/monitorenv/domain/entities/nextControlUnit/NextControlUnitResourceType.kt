package fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit

enum class NextControlUnitResourceType(
    val label: String
) {
    // TODO Complete that with the first types list once it's ready.
    // TODO Keys in French or English?
    // Don't forget to mirror any update here in the frontend enum.
    BARGE("Barge"),
    FRIGATE("Frégate"),
    SCHOOL_BOAT("Bâtiment-École");

    companion object {
        fun fromDisplayName(label: String): NextControlUnitResourceType? {
            return values().find { it.label == label }
        }
    }
}
