package fr.gouv.cacem.monitorenv.domain.mappers

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import fr.gouv.cacem.monitorenv.domain.exceptions.EntityConversionException
import org.springframework.stereotype.Component
import java.util.UUID

@Component
object EnvActionMapper {
    private const val jsonbNullString = "null"

    fun getEnvActionEntityFromJSON(mapper: ObjectMapper, value: String?, actionType: ActionTypeEnum, id: UUID): EnvActionEntity {
        return try {
            if (!value.isNullOrEmpty() && value != jsonbNullString) {
                when (actionType) {
                    ActionTypeEnum.SURVEILLANCE -> mapper.readValue(value, EnvActionSurveillanceProperties::class.java).toEnvActionSurveillanceEntity(id)
                    ActionTypeEnum.CONTROL -> mapper.readValue(value, EnvActionControlProperties::class.java).toEnvActionControlEntity(id)
                    ActionTypeEnum.NOTE -> mapper.readValue(value, EnvActionNoteProperties::class.java).toEnvActionNoteEntity(id)
                }
            } else {
                throw EntityConversionException("No action value found.")
            }
        } catch (e: Exception) {
            throw EntityConversionException("Error while converting 'action'. $value", e)
        }
    }
}
