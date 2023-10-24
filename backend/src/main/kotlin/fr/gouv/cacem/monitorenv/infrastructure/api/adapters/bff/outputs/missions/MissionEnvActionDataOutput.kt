package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
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
data class MissionEnvActionDataOutput(
    val id: UUID,
    val actionType: ActionTypeEnum,
    val actionStartDateTimeUtc: ZonedDateTime? = null,
    val actionEndDateTimeUtc: ZonedDateTime? = null,
    val department: String? = null,
    val facade: String? = null,
    val geom: Geometry? = null,
) {
    companion object {
        fun fromEnvActionEntity(envActionEntity: EnvActionEntity) = MissionEnvActionDataOutput(
            id = envActionEntity.id,
            actionType = envActionEntity.actionType,
            actionStartDateTimeUtc = envActionEntity.actionStartDateTimeUtc,
            actionEndDateTimeUtc = envActionEntity.actionEndDateTimeUtc,
            department = envActionEntity.department,
            facade = envActionEntity.facade,
            geom = envActionEntity.geom,
        )
    }
}
