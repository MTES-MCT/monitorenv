package fr.gouv.cacem.monitorenv.domain.entities.missions
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import org.locationtech.jts.geom.MultiPoint
import java.time.ZonedDateTime
import java.util.*

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME,
  include = JsonTypeInfo.As.PROPERTY,
  property = "actionType",
  visible = true)
@JsonSubTypes(
  JsonSubTypes.Type(EnvActionControlEntity::class, name = "CONTROL"),
  JsonSubTypes.Type(EnvActionSurveillanceEntity::class, name = "SURVEILLANCE"),
  JsonSubTypes.Type(EnvActionNoteEntity::class, name = "NOTE")
)
abstract class EnvActionEntity (
  open val id: UUID,
  open val actionType: ActionTypeEnum,
  open val actionStartDatetimeUtc: ZonedDateTime? = null,
  open val geom: MultiPoint? = null,
)
