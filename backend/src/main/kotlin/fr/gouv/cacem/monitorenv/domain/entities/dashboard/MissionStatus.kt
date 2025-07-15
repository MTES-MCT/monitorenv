package fr.gouv.cacem.monitorenv.domain.entities.dashboard

enum class MissionStatus(
    val label: String,
) {
    IN_PROGRESS("En cours"),
    DONE("Terminée"),
    FUTURE("À venir"),
}
