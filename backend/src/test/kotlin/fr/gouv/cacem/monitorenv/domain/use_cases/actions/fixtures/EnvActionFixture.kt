package fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.PatchableEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.mappers.EnvActionMapper
import java.time.ZonedDateTime
import java.util.UUID

class EnvActionFixture {

    companion object {
        fun anEnvAction(
            mapper: ObjectMapper,
            id: UUID,
        ): EnvActionEntity {
            return anEnvAction(
                mapper,
                id = id,
                startTime = ZonedDateTime.now(),
                endTime = ZonedDateTime.now().plusDays(1),
            )
        }

        fun anEnvAction(
            mapper: ObjectMapper,
            id: UUID,
            startTime: ZonedDateTime,
            endTime: ZonedDateTime,
        ): EnvActionEntity {
            return EnvActionMapper.getEnvActionEntityFromJSON(
                mapper,
                id = id,
                actionType = ActionTypeEnum.SURVEILLANCE,
                actionEndDateTimeUtc = endTime,
                actionStartDateTimeUtc = startTime,
                completedBy = "John Doe",
                completion = ActionCompletionEnum.COMPLETED,
                controlPlans = listOf(),
                department = "Department X",
                facade = "Facade Y",
                geom = null,
                isAdministrativeControl = true,
                isComplianceWithWaterRegulationsControl = false,
                isSafetyEquipmentAndStandardsComplianceControl = true,
                isSeafarersControl = false,
                openBy = "Jane Doe",
                missionId = 1,
                value = "{}",
            )
        }

        fun aPatchableEntity(objectMapper: ObjectMapper): PatchableEntity {
            val partialEnvActionAsJson = """
            {}
            """.trimIndent()
            val jsonNode = objectMapper.readTree(partialEnvActionAsJson)
            return PatchableEntity(jsonNode)
        }


    }
}
