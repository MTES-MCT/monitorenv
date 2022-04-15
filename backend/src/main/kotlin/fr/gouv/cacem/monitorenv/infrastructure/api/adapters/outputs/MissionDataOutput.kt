package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity

import java.time.ZonedDateTime

data class MissionDataOutput(
    val id: Int,
    val typeMission: String? = null,
    val statusMission: String? = null,
    val facade: String? = null,
    val theme: String? = null,
    val inputStartDatetimeUtc: ZonedDateTime? = null,
    val inputEndDatetimeUtc: ZonedDateTime? = null,
    val longitude: Double? = null,
    val latitude: Double? = null) {
    companion object {
        fun fromMission(mission: MissionEntity) = MissionDataOutput(
            id = mission.id,
            typeMission = mission.typeMission,
            statusMission = mission.statusMission,
            facade = mission.facade,
            theme = mission.theme,
            inputStartDatetimeUtc = mission.inputStartDatetimeUtc,
            inputEndDatetimeUtc = mission.inputEndDatetimeUtc,
            longitude = mission.longitude,
            latitude = mission.latitude,
        )
    }
}
