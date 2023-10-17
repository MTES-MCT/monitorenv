package fr.gouv.cacem.monitorenv.domain.mappers

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.EnvActionControlProperties
import fr.gouv.cacem.monitorenv.domain.entities.mission.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.EnvActionNoteProperties
import fr.gouv.cacem.monitorenv.domain.entities.mission.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.EnvActionSurveillanceProperties
import fr.gouv.cacem.monitorenv.domain.exceptions.EntityConversionException
import org.locationtech.jts.geom.Geometry
import org.springframework.stereotype.Component
import java.time.ZonedDateTime
import java.util.UUID

@Component
object EnvActionMapper {
    private const val jsonbNullString = "null"

    fun getEnvActionEntityFromJSON(
        mapper: ObjectMapper,
        id: UUID,
        actionStartDateTimeUtc: ZonedDateTime?,
        actionEndDateTimeUtc: ZonedDateTime?,
        geom: Geometry?,
        actionType: ActionTypeEnum,
        facade: String?,
        department: String?,
        value: String?,
        isAdministrativeControl: Boolean?,
        isComplianceWithWaterRegulationsControl: Boolean?,
        isSeafarersControl: Boolean?,
        isSafetyEquipmentAndStandardsComplianceControl: Boolean?,
    ): EnvActionEntity {
        return try {
            if (!value.isNullOrEmpty() && value != jsonbNullString) {
                when (actionType) {
                    ActionTypeEnum.SURVEILLANCE -> mapper.readValue(
                        value,
                        EnvActionSurveillanceProperties::class.java,
                    ).toEnvActionSurveillanceEntity(
                        id,
                        actionStartDateTimeUtc,
                        actionEndDateTimeUtc,
                        facade,
                        department,
                        geom,
                    )
                    ActionTypeEnum.CONTROL -> mapper.readValue(
                        value,
                        EnvActionControlProperties::class.java,
                    ).toEnvActionControlEntity(
                        id,
                        actionStartDateTimeUtc,
                        actionEndDateTimeUtc,
                        facade,
                        department,
                        geom,
                    )
                    ActionTypeEnum.NOTE -> mapper.readValue(
                        value,
                        EnvActionNoteProperties::class.java,
                    ).toEnvActionNoteEntity(id, actionStartDateTimeUtc, actionEndDateTimeUtc)
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
                        envAction as EnvActionSurveillanceEntity,
                    ),
                )
                ActionTypeEnum.CONTROL -> mapper.writeValueAsString(
                    EnvActionControlProperties.fromEnvActionControlEntity(
                        envAction as EnvActionControlEntity,
                    ),
                )
                ActionTypeEnum.NOTE -> mapper.writeValueAsString(
                    EnvActionNoteProperties.fromEnvActionNoteEntity(
                        envAction as EnvActionNoteEntity,
                    ),
                )
            }
        } catch (e: Exception) {
            throw EntityConversionException("Error while converting action to json $envAction", e)
        }
    }
}
