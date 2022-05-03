package fr.gouv.cacem.monitorenv.domain.entities.missions
import java.time.ZonedDateTime


data class MissionEntity(
        val id: Int,
        val missionType: MissionTypeEnum,
        val unit: String? = null,
        val administration: String? = null,
        val missionStatus: String? = null,
        val author: String? = null,
        val observations: String? = null,
        val facade: String? = null,
        val theme: String? = null,
        val inputStartDatetimeUtc: ZonedDateTime? = null,
        val inputEndDatetimeUtc: ZonedDateTime? = null,
        val actions: List<ActionEntity>? = listOf()
        )
