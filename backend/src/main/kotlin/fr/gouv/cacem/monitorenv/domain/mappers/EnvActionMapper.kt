package fr.gouv.cacem.monitorenv.domain.mappers

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import fr.gouv.cacem.monitorenv.domain.exceptions.EntityConversionException
import org.locationtech.jts.geom.MultiPoint
import org.springframework.stereotype.Component
import java.time.ZonedDateTime
import java.util.UUID

@Component
object EnvActionMapper {
    private const val jsonbNullString = "null"

    fun getEnvActionEntityFromJSON(mapper: ObjectMapper, id: UUID, actionStartDateTimeUtc: ZonedDateTime?, geom: MultiPoint?, actionType: ActionTypeEnum, value: String?): EnvActionEntity {
        return try {
            if (!value.isNullOrEmpty() && value != jsonbNullString) {
                when (actionType) {
                    ActionTypeEnum.SURVEILLANCE -> mapper.readValue(value, EnvActionSurveillanceProperties::class.java).toEnvActionSurveillanceEntity(id, actionStartDateTimeUtc, geom)
                    ActionTypeEnum.CONTROL -> mapper.readValue(value, EnvActionControlProperties::class.java).toEnvActionControlEntity(id, actionStartDateTimeUtc, geom)
                    ActionTypeEnum.NOTE -> mapper.readValue(value, EnvActionNoteProperties::class.java).toEnvActionNoteEntity(id, actionStartDateTimeUtc)
                }
            } else {
                throw EntityConversionException("No action value found.")
            }
        } catch (e: Exception) {
            throw EntityConversionException("Error while converting 'action'. $value", e)
        }
    }
    fun envActionEntityToJSON(mapper: ObjectMapper, envAction: EnvActionEntity): String {
        return try {
            when (envAction.actionType) {
                ActionTypeEnum.SURVEILLANCE -> mapper.writeValueAsString(
                    EnvActionSurveillanceProperties.fromEnvActionSurveillanceEntity(
                        envAction as EnvActionSurveillanceEntity
                    )
                )
                ActionTypeEnum.CONTROL -> mapper.writeValueAsString(
                    EnvActionControlProperties.fromEnvActionControlEntity(
                        envAction as EnvActionControlEntity
                    )
                )
                ActionTypeEnum.NOTE -> mapper.writeValueAsString(
                    EnvActionNoteProperties.fromEnvActionNoteEntity(
                        envAction as EnvActionNoteEntity
                    )
                )
            }
        } catch (e: Exception) {
            throw EntityConversionException("Error while converting action to json $envAction", e)
        }
    }
}
