package fr.gouv.cacem.monitorenv.domain.entities.dashboard

enum class NearbyUnitMissionStatus(
    val label: String,
) {
    IN_PROGRESS("En cours"),
    DONE("Terminée"),
    FUTURE("À venir"),
}
