package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance

import fr.gouv.cacem.monitorenv.domain.entities.Patchable
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionSurveillanceEntity(
    override val id: UUID,
    @Patchable
    override var actionEndDateTimeUtc: ZonedDateTime? = null,
    @Patchable
    override var actionStartDateTimeUtc: ZonedDateTime? = null,
    override val completedBy: String? = null,
    override val completion: ActionCompletionEnum? = null,
    override val controlPlans: List<EnvActionControlPlanEntity>? = listOf(),
    override val geom: Geometry? = null,
    override val facade: String? = null,
    override val department: String? = null,
    override val missionId: Int? = null,
    @Patchable
    override var observationsByUnit: String? = null,
    override val openBy: String? = null,
    val awareness: AwarenessEntity?,
    val observations: String? = null,
) : EnvActionEntity(
        id = id,
        actionType = ActionTypeEnum.SURVEILLANCE,
        missionId = missionId,
        observationsByUnit = observationsByUnit,
    )
