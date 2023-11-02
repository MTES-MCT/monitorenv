package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ThemeEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class MissionEnvActionSurveillanceDataOutput(
    override val id: UUID,
    override val actionEndDateTimeUtc: ZonedDateTime? = null,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val actionType: ActionTypeEnum = ActionTypeEnum.SURVEILLANCE,
    val coverMissionZone: Boolean? = null,
    override val department: String? = null,
    override val facade: String? = null,
    override val geom: Geometry? = null,
    val observations: String? = null,
    val reportingIds: List<Int>,
    val themes: List<ThemeEntity>? = listOf(),
) :
    MissionEnvActionDataOutput(
        id = id,
        actionEndDateTimeUtc = actionEndDateTimeUtc,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        actionType = ActionTypeEnum.SURVEILLANCE,
        department = department,
        facade = facade,
        geom = geom,
    ) {
    companion object {
        fun fromEnvActionSurveillanceEntity(
            envActionSurveillanceEntity: EnvActionSurveillanceEntity,
            reportingIds: List<Int>,
        ) =
            MissionEnvActionSurveillanceDataOutput(
                id = envActionSurveillanceEntity.id,
                actionEndDateTimeUtc = envActionSurveillanceEntity.actionEndDateTimeUtc,
                actionStartDateTimeUtc = envActionSurveillanceEntity.actionStartDateTimeUtc,
                department = envActionSurveillanceEntity.department,
                facade = envActionSurveillanceEntity.facade,
                geom = envActionSurveillanceEntity.geom,
                coverMissionZone = envActionSurveillanceEntity.coverMissionZone,
                observations = envActionSurveillanceEntity.observations,
                reportingIds = reportingIds,
                themes = envActionSurveillanceEntity.themes,
            )
    }
}
