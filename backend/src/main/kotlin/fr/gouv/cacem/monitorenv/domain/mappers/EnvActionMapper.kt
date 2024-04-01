package fr.gouv.cacem.monitorenv.domain.mappers

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.*
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlProperties
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
        actionEndDateTimeUtc: ZonedDateTime?,
        actionType: ActionTypeEnum,
        actionStartDateTimeUtc: ZonedDateTime?,
        completion: EnvActionCompletionEnum?,
        controlPlans: List<EnvActionControlPlanEntity>?,
        department: String?,
        facade: String?,
        geom: Geometry?,
        isAdministrativeControl: Boolean?,
        isComplianceWithWaterRegulationsControl: Boolean?,
        isSafetyEquipmentAndStandardsComplianceControl: Boolean?,
        isSeafarersControl: Boolean?,
        value: String?,
    ): EnvActionEntity {
        return try {
            if (!value.isNullOrEmpty() && value != jsonbNullString) {
                when (actionType) {
                    ActionTypeEnum.SURVEILLANCE ->
                        mapper.readValue(
                            value,
                            EnvActionSurveillanceProperties::class.java,
                        )
                            .toEnvActionSurveillanceEntity(
                                id = id,
                                actionEndDateTimeUtc = actionEndDateTimeUtc,
                                actionStartDateTimeUtc = actionStartDateTimeUtc,
                                completion = completion,
                                controlPlans = controlPlans,
                                department = department,
                                facade = facade,
                                geom = geom,
                            )
                    ActionTypeEnum.CONTROL ->
                        mapper.readValue(
                            value,
                            EnvActionControlProperties::class.java,
                        )
                            .toEnvActionControlEntity(
                                id = id,
                                actionEndDateTimeUtc = actionEndDateTimeUtc,
                                actionStartDateTimeUtc = actionStartDateTimeUtc,
                                completion = completion,
                                controlPlans = controlPlans,
                                department = department,
                                facade = facade,
                                geom = geom,
                                isAdministrativeControl = isAdministrativeControl,
                                isComplianceWithWaterRegulationsControl =
                                isComplianceWithWaterRegulationsControl,
                                isSafetyEquipmentAndStandardsComplianceControl =
                                isSafetyEquipmentAndStandardsComplianceControl,
                                isSeafarersControl = isSeafarersControl,
                            )
                    ActionTypeEnum.NOTE ->
                        mapper.readValue(
                            value,
                            EnvActionNoteProperties::class.java,
                        )
                            .toEnvActionNoteEntity(
                                id = id,
                                actionStartDateTimeUtc = actionStartDateTimeUtc,
                            )
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
                ActionTypeEnum.SURVEILLANCE ->
                    mapper.writeValueAsString(
                        EnvActionSurveillanceProperties.fromEnvActionSurveillanceEntity(
                            envAction as EnvActionSurveillanceEntity,
                        ),
                    )
                ActionTypeEnum.CONTROL ->
                    mapper.writeValueAsString(
                        EnvActionControlProperties.fromEnvActionControlEntity(
                            envAction as EnvActionControlEntity,
                        ),
                    )
                ActionTypeEnum.NOTE ->
                    mapper.writeValueAsString(
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
