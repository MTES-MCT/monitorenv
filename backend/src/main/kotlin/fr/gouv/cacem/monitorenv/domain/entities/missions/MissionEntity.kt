package fr.gouv.cacem.monitorenv.domain.entities.missions
import java.time.ZonedDateTime


data class MissionEntity(
        val id: Int,
        val typeMission: String? = null,
        val statusMission: String? = null,
        val facade: String? = null,
        val theme: String? = null,
        val inputStartDatetimeUtc: ZonedDateTime? = null,
        val inputEndDatetimeUtc: ZonedDateTime? = null,
        val longitude: Double? = null,
        val latitude: Double? = null,
        )

typealias MissionsListEntity = List<MissionEntity>