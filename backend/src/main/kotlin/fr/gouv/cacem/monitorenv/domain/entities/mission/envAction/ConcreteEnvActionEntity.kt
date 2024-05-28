package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class ConcreteEnvActionEntity(
    override val id: UUID,
    override val actionType: ActionTypeEnum,
    override val actionEndDateTimeUtc: ZonedDateTime? = null,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val completedBy: String? = null,
    override val completion: ActionCompletionEnum? = null,
    override val controlPlans: List<EnvActionControlPlanEntity>? = listOf(),
    override val department: String? = null,
    override val facade: String? = null,
    override val geom: Geometry? = null,
    override val isAdministrativeControl: Boolean? = null,
    override val isComplianceWithWaterRegulationsControl: Boolean? = null,
    override val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = null,
    override val isSeafarersControl: Boolean? = null,
    override val openBy: String? = null,
) : EnvActionEntity(
    id,
    actionType,
    actionEndDateTimeUtc,
    actionStartDateTimeUtc,
    completedBy,
    completion,
    controlPlans,
    department,
    facade,
    geom,
    isAdministrativeControl,
    isComplianceWithWaterRegulationsControl,
    isSafetyEquipmentAndStandardsComplianceControl,
    isSeafarersControl,
    openBy,
)
