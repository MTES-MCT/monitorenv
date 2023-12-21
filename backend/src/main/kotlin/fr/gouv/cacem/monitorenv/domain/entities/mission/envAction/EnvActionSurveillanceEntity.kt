package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionSurveillanceEntity(
    override val id: UUID,
    override val actionEndDateTimeUtc: ZonedDateTime? = null,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val controlPlans: List<EnvActionControlPlanEntity>? = listOf(),
    override val geom: Geometry? = null,
    override val facade: String? = null,
    override val department: String? = null,
    val coverMissionZone: Boolean? = null,
    val observations: String? = null,
    @Deprecated("Use controlPlans instead") val themes: List<ThemeEntity>? = listOf(),
) :
    EnvActionEntity(
        actionType = ActionTypeEnum.SURVEILLANCE,
        id = id,
    )
