package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.InfractionsObservationsReportEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

class JpaInfractionsObservationsReportITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaInfractionsObservationsReportRepository: JpaInfractionsObservationsReportRepository

    @Test
    @Transactional
    fun `save should create a new InfractionsObservationsReport`() {
        // Given
        val numberOfExistingInfractionsObservationsReport = jpaInfractionsObservationsReportRepository.count()
        assertThat(numberOfExistingInfractionsObservationsReport).isEqualTo(3)

        // When
        val newInfractionsObservationsReport = InfractionsObservationsReportEntity(
            createdAt = ZonedDateTime.parse("2023-04-01T00:00:00Z"),
            isDeleted = false,
        )
        val createdInfractionsObservationsReport = jpaInfractionsObservationsReportRepository.save(newInfractionsObservationsReport)

        // Then
        assertThat(createdInfractionsObservationsReport.id).isNotNull()

        val numberOfExistingInfractionsObservationsReportAfterSave = jpaInfractionsObservationsReportRepository.count()
        assertThat(numberOfExistingInfractionsObservationsReportAfterSave).isEqualTo(4)
    }
}
