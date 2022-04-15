package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs

import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import java.time.ZonedDateTime

data class UpdateMissionDataInput(
    val id: Int,
    val typeMission: String? = null,
    val statusMission: String? = null,
    val facade: String? = null,
    val theme: String? = null,
    val inputStartDatetimeUtc: ZonedDateTime? = null,
    val inputEndDatetimeUtc: ZonedDateTime? = null,
    val longitude: Double? = null,
    val latitude: Double? = null,
) {
    fun toMissionEntity() :MissionEntity {
        return MissionEntity(
            id= this.id,
            typeMission = this.typeMission,
            statusMission = this.statusMission,
            facade = this.facade,
            theme = this.theme,
            inputStartDatetimeUtc = this.inputStartDatetimeUtc,
            inputEndDatetimeUtc = this.inputEndDatetimeUtc,
            longitude = this.longitude,
            latitude = this.latitude,
        )
    }
}
