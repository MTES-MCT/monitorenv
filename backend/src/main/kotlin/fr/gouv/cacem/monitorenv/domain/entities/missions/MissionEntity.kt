package fr.gouv.cacem.monitorenv.domain.entities.missions
import java.time.ZonedDateTime


data class MissionEntity(
        val id: Int,
        val missionType: MissionType,
        val missionStatus: String? = null,
        val facade: String? = null,
        val theme: String? = null,
        val observations: String? = null,
        val inputStartDatetimeUtc: ZonedDateTime? = null,
        val inputEndDatetimeUtc: ZonedDateTime? = null,
        val actions: List<ActionEntity>? = null
        )


data class NewMissionEntity(
        val missionType: MissionType,
        val missionStatus: String? = null,
        val facade: String? = null,
        val theme: String? = null,
        val observations: String? = null,
        val inputStartDatetimeUtc: ZonedDateTime? = null,
        val inputEndDatetimeUtc: ZonedDateTime? = null,
        val actions: List<ActionEntity>? = null
)