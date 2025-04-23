package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "actionType",
    visible = true,
)
@JsonSubTypes(
    JsonSubTypes.Type(EnvActionControlEntity::class, name = "CONTROL"),
    JsonSubTypes.Type(EnvActionSurveillanceEntity::class, name = "SURVEILLANCE"),
    JsonSubTypes.Type(EnvActionNoteEntity::class, name = "NOTE"),
)
abstract class EnvActionEntity(
    open val id: UUID,
    open val actionType: ActionTypeEnum,
    open var actionEndDateTimeUtc: ZonedDateTime? = null,
    open var actionStartDateTimeUtc: ZonedDateTime? = null,
    open val completedBy: String? = null,
    open val completion: ActionCompletionEnum? = null,
    open val controlPlans: List<EnvActionControlPlanEntity>? = listOf(),
    open val department: String? = null,
    open val facade: String? = null,
    open val geom: Geometry? = null,
    open val isAdministrativeControl: Boolean? = null,
    open val isComplianceWithWaterRegulationsControl: Boolean? = null,
    open val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = null,
    open val isSeafarersControl: Boolean? = null,
    open val openBy: String? = null,
    open var observationsByUnit: String? = null,
)
