package fr.gouv.cacem.monitorenv.domain.validators.reporting

import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReporting
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingSourceControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingSourceOther
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingSourceSemaphore
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource

class ReportingValidatorUTest {
    private val reportingValidator = ReportingValidator()

    @ParameterizedTest
    @ValueSource(strings = ["A", "AA", "AAAA"])
    fun `validate should throw an exception if there is a control with openBy is not a trigram`(openBy: String) {
        val reporting = aReporting(openBy = openBy)

        val assertThrows =
            assertThrows(BackendUsageException::class.java) {
                reportingValidator.validate(reporting)
            }
        assertThat(assertThrows.data)
            .isEqualTo("Le trigramme \"ouvert par\" doit avoir 3 lettres")
    }

    @Test
    fun `validate should throw an exception if reportingSource is empty`() {
        val reporting = aReporting(reportingSources = listOf())

        val assertThrows =
            assertThrows(BackendUsageException::class.java) {
                reportingValidator.validate(reporting)
            }
        assertThat(assertThrows.data).isEqualTo("Une source du signalement est obligatoire")
    }

    @Test
    fun `validate should throw an exception if reportingSource from control unit is invalid`() {
        val reporting =
            aReporting(
                reportingSources =
                    listOf(aReportingSourceControlUnit().copy(semaphoreId = 1)),
            )

        val assertThrows =
            assertThrows(BackendUsageException::class.java) {
                reportingValidator.validate(reporting)
            }
        assertThat(assertThrows.data).isEqualTo("La source du signalement est invalide")
    }

    @Test
    fun `validate should throw an exception if reportingSource from semaphore is invalid`() {
        val reporting =
            aReporting(
                reportingSources =
                    listOf(aReportingSourceSemaphore().copy(sourceName = "test")),
            )

        val assertThrows =
            assertThrows(BackendUsageException::class.java) {
                reportingValidator.validate(reporting)
            }
        assertThat(assertThrows.data).isEqualTo("La source du signalement est invalide")
    }

    @Test
    fun `validate should throw an exception if reportingSource from other is invalid`() {
        val reporting =
            aReporting(
                reportingSources = listOf(aReportingSourceOther().copy(controlUnitId = 1)),
            )

        val assertThrows =
            assertThrows(BackendUsageException::class.java) {
                reportingValidator.validate(reporting)
            }
        assertThat(assertThrows.data).isEqualTo("La source du signalement est invalide")
    }

    @Test
    fun `validate should throw an exception if validityTime is less than 1`() {
        val reporting = aReporting(validityTime = 0)

        val assertThrows =
            assertThrows(BackendUsageException::class.java) {
                reportingValidator.validate(reporting)
            }
        assertThat(assertThrows.data)
            .isEqualTo("La validité du signalement doit être supérieur à 0")
    }

    @Test
    fun `validate should throw an exception if targetType is OTHER without description`() {
        val reporting = aReporting(targetType = TargetTypeEnum.OTHER, description = null)

        val assertThrows =
            assertThrows(BackendUsageException::class.java) {
                reportingValidator.validate(reporting)
            }
        assertThat(assertThrows.data).isEqualTo("La description de la cible est obligatoire")
    }

    @Test
    fun `validate should pass for a valid ReportingEntity`() {
        val reporting = aReporting()

        reportingValidator.validate(reporting)
    }
}
