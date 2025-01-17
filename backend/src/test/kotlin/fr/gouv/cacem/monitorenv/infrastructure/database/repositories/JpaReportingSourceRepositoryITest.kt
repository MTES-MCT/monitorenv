package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingSourceControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingSourceSemaphore
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBReportingRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBSemaphoreRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired

class JpaReportingSourceRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaReportingSourceRepository: JpaReportingSourceRepository

    @Autowired
    private lateinit var reportingRepository: IDBReportingRepository

    @Autowired
    private lateinit var controlUnitRepository: IDBControlUnitRepository

    @Autowired
    private lateinit var semaphoreRepository: IDBSemaphoreRepository

    @Test
    fun `save should persist reportingSource when source is SEMAPHORE`() {
        // Given
        val reportingSourceEntity = aReportingSourceSemaphore(reportingId = 4, semaphoreId = 21)

        // When
        val reportingSourceDTO = jpaReportingSourceRepository.save(reportingSourceEntity)

        // Then
        assertThat(reportingSourceDTO.reportingSource.id).isNotNull()
        assertThat(reportingSourceDTO.controlUnit).isNull()
        assertThat(reportingSourceDTO.semaphore?.id).isEqualTo(reportingSourceEntity.semaphoreId)
    }

    @Test
    fun `save should persist reportingSource when source is CONTROLUNIT`() {
        // Given
        val reportingSourceEntity = aReportingSourceControlUnit(reportingId = 4, controlUnitId = 10000)

        // When
        val reportingSourceDTO = jpaReportingSourceRepository.save(reportingSourceEntity)

        // Then
        assertThat(reportingSourceDTO.reportingSource.id).isNotNull()
        assertThat(reportingSourceDTO.controlUnit?.id).isEqualTo(reportingSourceEntity.controlUnitId)
        assertThat(reportingSourceDTO.semaphore).isNull()
    }

    @Test
    fun `save should throw an exception when reportingId is null`() {
        // Given
        val reportingSourceEntity = aReportingSourceSemaphore(reportingId = null, semaphoreId = 21)

        // When & Then
        assertThrows<BackendUsageException> { jpaReportingSourceRepository.save(reportingSourceEntity) }
    }
}
