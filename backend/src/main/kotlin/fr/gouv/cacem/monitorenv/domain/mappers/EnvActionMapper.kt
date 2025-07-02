package fr.gouv.cacem.monitorenv.domain.mappers

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteProperties
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlProperties
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceProperties
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import org.locationtech.jts.geom.Geometry
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.ZonedDateTime
import java.util.UUID

@Component
object EnvActionMapper {
    private val logger = LoggerFactory.getLogger(EnvActionMapper::class.java)

    fun getEnvActionEntityFromJSON(
        mapper: ObjectMapper,
        id: UUID,
        actionEndDateTimeUtc: ZonedDateTime?,
        actionType: ActionTypeEnum,
        actionStartDateTimeUtc: ZonedDateTime?,
        completedBy: String?,
        completion: ActionCompletionEnum?,
        department: String?,
        facade: String?,
        geom: Geometry?,
        isAdministrativeControl: Boolean?,
        isComplianceWithWaterRegulationsControl: Boolean?,
        isSafetyEquipmentAndStandardsComplianceControl: Boolean?,
        isSeafarersControl: Boolean?,
        observationsByUnit: String?,
        openBy: String?,
        value: String?,
        tags: List<TagEntity>,
        themes: List<ThemeEntity>,
    ): EnvActionEntity =
        try {
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
                            department = department,
                            facade = facade,
                            geom = geom,
                            observationsByUnit = observationsByUnit,
                            openBy = openBy,
                            tags = tags,
                            themes = themes,
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
                            department = department,
                            facade = facade,
                            geom = geom,
                            isAdministrativeControl = isAdministrativeControl,
                            isComplianceWithWaterRegulationsControl =
                            isComplianceWithWaterRegulationsControl,
                            isSafetyEquipmentAndStandardsComplianceControl =
                            isSafetyEquipmentAndStandardsComplianceControl,
                            isSeafarersControl = isSeafarersControl,
                            observationsByUnit = observationsByUnit,
                            openBy = openBy,
                            tags = tags,
                            themes = themes,
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
                            observationsByUnit = observationsByUnit,
                        )
            }
        } catch (e: Exception) {
            val errorMessage = "Cannot parse envAction from JSON"
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.UNVALID_PROPERTY, errorMessage)
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
            val errorMessage = "Cannot parse envAction to JSON"
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.UNVALID_PROPERTY, errorMessage)
        }
}
