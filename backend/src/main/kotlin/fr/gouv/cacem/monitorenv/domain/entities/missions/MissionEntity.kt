package fr.gouv.cacem.monitorenv.domain.entities.missions
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime


data class MissionEntity(
        val id: Int? = null,
        val missionType: MissionTypeEnum,
        val administration: String? = null,
        val unit: String? = null,
        val resources: List<String>? = listOf(),
        val missionStatus: String? = null,
        val author: String? = null,
        val closed_by: String? = null,
        val observations: String? = null,
        val facade: String? = null,
        val theme: String? = null,
        val geom: MultiPolygon? = null,
        val inputStartDatetimeUtc: ZonedDateTime? = null,
        val inputEndDatetimeUtc: ZonedDateTime? = null,
        val actions: List<ActionEntity>? = listOf(),
        )
