package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl

import fr.gouv.cacem.monitorenv.domain.entities.Patchable
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionControlEntity(
    override val id: UUID,
    @Patchable
    override var actionEndDateTimeUtc: ZonedDateTime? = null,
    @Patchable
    override var actionStartDateTimeUtc: ZonedDateTime? = null,
    override val completedBy: String? = null,
    override val completion: ActionCompletionEnum? = null,
    override var controlPlans: List<EnvActionControlPlanEntity>? = listOf(),
    override val department: String? = null,
    override val facade: String? = null,
    override val geom: Geometry? = null,
    override val isAdministrativeControl: Boolean? = null,
    override val isComplianceWithWaterRegulationsControl: Boolean? = null,
    override val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = null,
    override val isSeafarersControl: Boolean? = null,
    @Patchable
    override var observationsByUnit: String? = null,
    override val openBy: String? = null,
    val actionNumberOfControls: Int? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    val infractions: List<InfractionEntity>? = listOf(),
    val observations: String? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val tags: List<TagEntity>,
    var themes: List<ThemeEntity>,
) : EnvActionEntity(
        id = id,
        actionType = ActionTypeEnum.CONTROL,
        observationsByUnit = observationsByUnit,
    )
