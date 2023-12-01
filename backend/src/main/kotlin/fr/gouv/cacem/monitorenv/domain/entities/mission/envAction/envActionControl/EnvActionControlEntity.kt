package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import java.time.ZonedDateTime
import java.util.UUID
import org.locationtech.jts.geom.Geometry

data class EnvActionControlEntity(
        override val id: UUID,
        override val actionEndDateTimeUtc: ZonedDateTime? = null,
        override val actionStartDateTimeUtc: ZonedDateTime? = null,
        override val controlPlans: List<EnvActionControlPlanEntity>? = listOf(),
        override val department: String? = null,
        override val facade: String? = null,
        override val geom: Geometry? = null,
        override val isAdministrativeControl: Boolean? = null,
        override val isComplianceWithWaterRegulationsControl: Boolean? = null,
        override val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = null,
        override val isSeafarersControl: Boolean? = null,
        val actionNumberOfControls: Int? = null,
        val actionTargetType: ActionTargetTypeEnum? = null,
        val infractions: List<InfractionEntity>? = listOf(),
        val observations: String? = null,
        @Deprecated("Use controlPlan instead") val themes: List<ThemeEntity>? = listOf(),
        val vehicleType: VehicleTypeEnum? = null,
) :
        EnvActionEntity(
                id = id,
                actionType = ActionTypeEnum.CONTROL,
        )
