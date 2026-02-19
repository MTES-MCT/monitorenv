package fr.gouv.cacem.monitorenv.domain.mappers

import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvActionControl
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import tools.jackson.databind.json.JsonMapper

class EnvActionMapperUTest {
    private val jsonMapper = JsonMapper()

    @Test
    fun `getEnvActionEntityFromJSON should return a envActionControlEntity when actionType is Control`() {
        val value =
            """
            {
		"infractions": [
			{
				"id": "8a084950-4e98-4382-98f2-e85d70995b85",
				"administrativeResponse": "NONE",
				"natinf": [
					"4473"
				],
				"observations": "",
				"registrationNumber": null,
				"companyName": null,
				"relevantCourt": null,
				"imo": null,
				"infractionType": "WITHOUT_REPORT",
				"formalNotice": "NO",
				"mmsi": "249612000",
				"nbTarget": 1,
				"controlledPersonIdentity": null,
				"seizure": "NO",
				"vesselName": "THYKE III",
				"vesselSize": 27,
				"vesselType": null
			}
		]
}
            """.trimIndent()

        val envActionEntity = anEnvActionControl()

        val envActionEntityFromJSON =
            EnvActionMapper.getEnvActionEntityFromJSON(
                jsonMapper,
                envActionEntity.id,
                envActionEntity.actionEndDateTimeUtc,
                envActionEntity.actionType,
                envActionEntity.actionStartDateTimeUtc,
                envActionEntity.completedBy,
                envActionEntity.completion,
                envActionEntity.department,
                envActionEntity.facade,
                envActionEntity.geom,
                envActionEntity.isAdministrativeControl,
                envActionEntity.isComplianceWithWaterRegulationsControl,
                envActionEntity.isSafetyEquipmentAndStandardsComplianceControl,
                envActionEntity.isSeafarersControl,
                envActionEntity.observationsByUnit,
                envActionEntity.openBy,
                value,
                envActionEntity.tags,
                envActionEntity.themes,
            )

        assertThat(envActionEntityFromJSON)
            .usingRecursiveComparison()
            // value fields
            .ignoringFields("infractions", "actionNumberOfControls", "actionTargetType", "observations", "vehiculeType")
            .isEqualTo(envActionEntity)
    }

    @Test
    fun `getEnvActionEntityFromJSON should throw BackendUsageException when value is 'null'`() {
        val value = "null"

        val envActionEntity = anEnvActionControl()

        val exception =
            assertThrows<BackendUsageException> {
                EnvActionMapper.getEnvActionEntityFromJSON(
                    jsonMapper,
                    envActionEntity.id,
                    envActionEntity.actionEndDateTimeUtc,
                    envActionEntity.actionType,
                    envActionEntity.actionStartDateTimeUtc,
                    envActionEntity.completedBy,
                    envActionEntity.completion,
                    envActionEntity.department,
                    envActionEntity.facade,
                    envActionEntity.geom,
                    envActionEntity.isAdministrativeControl,
                    envActionEntity.isComplianceWithWaterRegulationsControl,
                    envActionEntity.isSafetyEquipmentAndStandardsComplianceControl,
                    envActionEntity.isSeafarersControl,
                    envActionEntity.observationsByUnit,
                    envActionEntity.openBy,
                    value,
                    envActionEntity.tags,
                    envActionEntity.themes,
                )
            }

        assertThat(exception.message).isEqualTo("Cannot parse envAction from JSON")
    }

    @Test
    fun `getEnvActionEntityFromJSON should throw BackendUsageException when value is null`() {
        val value = null

        val envActionEntity = anEnvActionControl()

        val exception =
            assertThrows<BackendUsageException> {
                EnvActionMapper.getEnvActionEntityFromJSON(
                    jsonMapper,
                    envActionEntity.id,
                    envActionEntity.actionEndDateTimeUtc,
                    envActionEntity.actionType,
                    envActionEntity.actionStartDateTimeUtc,
                    envActionEntity.completedBy,
                    envActionEntity.completion,
                    envActionEntity.department,
                    envActionEntity.facade,
                    envActionEntity.geom,
                    envActionEntity.isAdministrativeControl,
                    envActionEntity.isComplianceWithWaterRegulationsControl,
                    envActionEntity.isSafetyEquipmentAndStandardsComplianceControl,
                    envActionEntity.isSeafarersControl,
                    envActionEntity.observationsByUnit,
                    envActionEntity.openBy,
                    value,
                    envActionEntity.tags,
                    envActionEntity.themes,
                )
            }

        assertThat(exception.message).isEqualTo("Cannot parse envAction from JSON")
    }
}
