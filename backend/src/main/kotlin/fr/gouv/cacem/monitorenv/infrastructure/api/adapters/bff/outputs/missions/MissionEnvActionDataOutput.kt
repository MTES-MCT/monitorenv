package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
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
    JsonSubTypes.Type(MissionEnvActionControlDataOutput::class, name = "CONTROL"),
    JsonSubTypes.Type(MissionEnvActionSurveillanceDataOutput::class, name = "SURVEILLANCE"),
    JsonSubTypes.Type(MissionEnvActionNoteDataOutput::class, name = "NOTE"),
)
abstract class MissionEnvActionDataOutput(
    open val id: UUID,
    open val actionEndDateTimeUtc: ZonedDateTime? = null,
    open val actionStartDateTimeUtc: ZonedDateTime? = null,
    open val actionType: ActionTypeEnum,
    open val department: String? = null,
    open val facade: String? = null,
    open val geom: Geometry? = null,
)
