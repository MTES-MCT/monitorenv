package fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish

enum class InfractionTypeEnum(val value: String) {
    WITH_RECORD("WITH_RECORD"),
    WITHOUT_RECORD("WITHOUT_RECORD"),
    PENDING("PENDING"),
}
