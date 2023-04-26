package fr.gouv.cacem.monitorenv.domain.entities.missions
import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class MissionEntity(
    val id: Int? = null,
    val missionTypes: List<MissionTypeEnum>,
    val missionNature: List<MissionNatureEnum>? = listOf(),
    val controlUnits: List<ControlUnitEntity> = listOf(),
    val openBy: String? = null,
    val closedBy: String? = null,
    val observationsCacem: String? = null,
    val observationsCnsp: String? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val startDateTimeUtc: ZonedDateTime,
    val endDateTimeUtc: ZonedDateTime? = null,
    val envActions: List<EnvActionEntity>? = listOf(),
    val isClosed: Boolean,
    val isDeleted: Boolean,
    val missionSource: MissionSourceEnum,
    val hasMissionOrder: Boolean,
    val isUnderJdp: Boolean
)
