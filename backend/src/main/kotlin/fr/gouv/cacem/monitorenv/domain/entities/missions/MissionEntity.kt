package fr.gouv.cacem.monitorenv.domain.entities.missions
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime


data class MissionEntity(
        val id: Int? = null,
        val missionType: MissionTypeEnum,
        val missionStatus: MissionStatusEnum,
        val missionNature: List<MissionNatureEnum>? = listOf(),
        val resourceUnits: List<ResourceUnitEntity>? = listOf(),
        val openBy: String? = null,
        val closedBy: String? = null,
        val observations: String? = null,
        val facade: String? = null,
        val geom: MultiPolygon? = null,
        val inputStartDatetimeUtc: ZonedDateTime,
        val inputEndDatetimeUtc: ZonedDateTime? = null,
        val envActions: List<EnvActionEntity>? = listOf(),
        )
