package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

class JpaReportingITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaReportingRepository: JpaReportingRepository

    @Test
    @Transactional
    fun `save should create a new Reporting`() {
        // Given
        val numberOfExistingReportings = jpaReportingRepository.count()
        assertThat(numberOfExistingReportings).isEqualTo(3)

        // When
        val newReporting = ReportingEntity(
            createdAt = ZonedDateTime.parse("2023-04-01T00:00:00Z"),
            isArchived = false,
            isDeleted = false,
        )
        val createdReporting = jpaReportingRepository.save(newReporting)

        // Then
        assertThat(createdReporting.id).isNotNull()

        val numberOfExistingReportingsAfterSave = jpaReportingRepository.count()
        assertThat(numberOfExistingReportingsAfterSave).isEqualTo(4)
    }
}
