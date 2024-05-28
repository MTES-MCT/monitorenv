package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ConcreteEnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionOutput(
    val id: UUID,
    val actionType: String,
    val actionEndDateTimeUtc: ZonedDateTime?,
    val actionStartDateTimeUtc: ZonedDateTime?,
    val completedBy: String?,
    val completion: String?,
    val controlPlans: List<EnvActionControlPlanEntity>?,
    val department: String?,
    val facade: String?,
    val geom: Geometry?,
    val isAdministrativeControl: Boolean?,
    val isComplianceWithWaterRegulationsControl: Boolean?,
    val isSafetyEquipmentAndStandardsComplianceControl: Boolean?,
    val isSeafarersControl: Boolean?,
    val openBy: String?,
) {
    companion object {
        fun fromEntity(entity: ConcreteEnvActionEntity): EnvActionOutput {
            return EnvActionOutput(
                id = entity.id,
                actionType = entity.actionType.toString(),
                actionEndDateTimeUtc = entity.actionEndDateTimeUtc,
                actionStartDateTimeUtc = entity.actionStartDateTimeUtc,
                completedBy = entity.completedBy,
                completion = entity.completion?.toString(),
                controlPlans = entity.controlPlans,
                department = entity.department,
                facade = entity.facade,
                geom = entity.geom,
                isAdministrativeControl = entity.isAdministrativeControl,
                isComplianceWithWaterRegulationsControl = entity.isComplianceWithWaterRegulationsControl,
                isSafetyEquipmentAndStandardsComplianceControl = entity.isSafetyEquipmentAndStandardsComplianceControl,
                isSeafarersControl = entity.isSeafarersControl,
                openBy = entity.openBy,
            )
        }
    }
}
