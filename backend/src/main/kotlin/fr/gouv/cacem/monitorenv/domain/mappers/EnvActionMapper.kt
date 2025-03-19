package fr.gouv.cacem.monitorenv.domain.mappers

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.*
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlProperties
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceProperties
import fr.gouv.cacem.monitorenv.domain.exceptions.EntityConversionException
import org.locationtech.jts.geom.Geometry
import org.springframework.stereotype.Component
import java.time.ZonedDateTime
import java.util.*

@Component
object EnvActionMapper {
    private const val JSONB_NULL_STRING = "null"

    fun getEnvActionEntityFromJSON(
        mapper: ObjectMapper,
        id: UUID,
        actionEndDateTimeUtc: ZonedDateTime?,
        actionType: ActionTypeEnum,
        actionStartDateTimeUtc: ZonedDateTime?,
        completedBy: String?,
        completion: ActionCompletionEnum?,
        controlPlans: List<EnvActionControlPlanEntity>?,
        department: String?,
        facade: String?,
        geom: Geometry?,
        isAdministrativeControl: Boolean?,
        isComplianceWithWaterRegulationsControl: Boolean?,
        isSafetyEquipmentAndStandardsComplianceControl: Boolean?,
        isSeafarersControl: Boolean?,
        missionId: Int?,
        observationsByUnit: String?,
        openBy: String?,
        value: String?,
    ): EnvActionEntity =
        try {
            if (!value.isNullOrEmpty() && value != JSONB_NULL_STRING) {
                when (actionType) {
                    ActionTypeEnum.SURVEILLANCE ->
                        mapper
                            .readValue(
                                value,
                                EnvActionSurveillanceProperties::class.java,
                            ).toEnvActionSurveillanceEntity(
                                id = id,
                                actionEndDateTimeUtc = actionEndDateTimeUtc,
                                actionStartDateTimeUtc = actionStartDateTimeUtc,
                                completedBy = completedBy,
                                completion = completion,
                                controlPlans = controlPlans,
                                department = department,
                                facade = facade,
                                geom = geom,
                                missionId = missionId,
                                observationsByUnit = observationsByUnit,
                                openBy = openBy,
                            )

                    ActionTypeEnum.CONTROL ->
                        mapper
                            .readValue(
                                value,
                                EnvActionControlProperties::class.java,
                            ).toEnvActionControlEntity(
                                id = id,
                                actionEndDateTimeUtc = actionEndDateTimeUtc,
                                actionStartDateTimeUtc = actionStartDateTimeUtc,
                                completedBy = completedBy,
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
                                missionId = missionId,
                                observationsByUnit = observationsByUnit,
                                openBy = openBy,
                            )

                    ActionTypeEnum.NOTE ->
                        mapper
                            .readValue(
                                value,
                                EnvActionNoteProperties::class.java,
                            ).toEnvActionNoteEntity(
                                id = id,
                                actionStartDateTimeUtc = actionStartDateTimeUtc,
                                completion = completion,
                                missionId = missionId,
                                observationsByUnit = observationsByUnit,
                            )
                }
            } else {
                throw EntityConversionException("No action value found.")
            }
        } catch (e: Exception) {
            throw EntityConversionException("Error while converting 'action'. $value", e)
        }

    fun envActionEntityToJSON(
        mapper: ObjectMapper,
        envAction: EnvActionEntity,
    ): String =
        try {
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
