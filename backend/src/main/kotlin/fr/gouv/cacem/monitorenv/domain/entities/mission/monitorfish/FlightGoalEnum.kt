package fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish

enum class FlightGoalEnum(val value: String) {
    VMS_AIS_CHECK("VMS_AIS_CHECK"),
    UNAUTHORIZED_FISHING("UNAUTHORIZED_FISHING"),
    CLOSED_AREA("CLOSED_AREA"),
}
