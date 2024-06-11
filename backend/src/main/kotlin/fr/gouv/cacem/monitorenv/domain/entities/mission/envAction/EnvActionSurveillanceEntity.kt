package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionSurveillanceEntity(
    override val id: UUID,
    override val actionEndDateTimeUtc: ZonedDateTime? = null,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val completedBy: String? = null,
    override val completion: ActionCompletionEnum? = null,
    override val controlPlans: List<EnvActionControlPlanEntity>? = listOf(),
    override val geom: Geometry? = null,
    override val facade: String? = null,
    override val department: String? = null,
    override val missionId: Int? = null,
    override val openBy: String? = null,
    val observations: String? = null,
) :
    EnvActionEntity(
        id = id,
        actionType = ActionTypeEnum.SURVEILLANCE,
        missionId = missionId,
    )
