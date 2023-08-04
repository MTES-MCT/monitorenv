package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.domain.Pageable
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

@SpringBootTest(properties = ["monitorenv.scheduling.enable=false"])
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

    @Test
    fun `findById should return specified reporting`() {
        val reporting = jpaReportingRepository.findById(1)
        assertThat(reporting.id).isEqualTo(1)
        assertThat(reporting.reportingId).isEqualTo(2300001)
        assertThat(reporting.sourceType).isEqualTo(SourceTypeEnum.SEMAPHORE)
        assertThat(reporting.semaphoreId).isEqualTo(21)
        assertThat(reporting.controlUnitId).isNull()
        assertThat(reporting.sourceName).isNull()
        assertThat(reporting.targetType).isEqualTo(TargetTypeEnum.VEHICLE)
        assertThat(reporting.vehicleType).isEqualTo(VehicleTypeEnum.VESSEL)
        assertThat(reporting.validityTime).isEqualTo(24)
        assertThat(reporting.isDeleted).isEqualTo(false)
    }

    @Test
    fun `findAll should return all reportings`() {
        val reportings = jpaReportingRepository.findAll(Pageable.unpaged())
        assertThat(reportings.size).isEqualTo(3)
    }

    @Test
    @Transactional
    fun `save should update an existing Reporting`() {
        // Given
        val numberOfExistingReportings = jpaReportingRepository.count()
        assertThat(numberOfExistingReportings).isEqualTo(3)

        // When
        val existingReporting = jpaReportingRepository.findById(1)
        val updatedReporting = existingReporting.copy(
            sourceType = SourceTypeEnum.SEMAPHORE,
            semaphoreId = 23,
            createdAt = ZonedDateTime.parse("2023-04-01T00:00:00Z"),
            isArchived = false,
            isDeleted = false,
        )
        val savedReporting = jpaReportingRepository.save(updatedReporting)

        // Then
        assertThat(savedReporting.id).isEqualTo(1)
        assertThat(savedReporting.sourceType).isEqualTo(SourceTypeEnum.SEMAPHORE)
        assertThat(savedReporting.semaphoreId).isEqualTo(23)

        val numberOfExistingReportingsAfterSave = jpaReportingRepository.count()
        assertThat(numberOfExistingReportingsAfterSave).isEqualTo(3)
    }

    @Test
    @Transactional
    fun `delete should soft delete reporting`() {
        // Given
        val numberOfExistingReportings = jpaReportingRepository.count()
        assertThat(numberOfExistingReportings).isEqualTo(3)
        val existingReporting = jpaReportingRepository.findById(1)
        assertThat(existingReporting.isDeleted).isEqualTo(false)
        // When
        jpaReportingRepository.delete(1)

        // Then
        val numberOfExistingReportingsAfterSave = jpaReportingRepository.count()
        assertThat(numberOfExistingReportingsAfterSave).isEqualTo(3)

        val deletedReporting = jpaReportingRepository.findById(1)
        assertThat(deletedReporting.isDeleted).isEqualTo(true)
    }

    @Test
    @Transactional
    fun `archive should archive outdated reporting`() {
        // Given
        val existingReporting = jpaReportingRepository.findById(1)
        assertThat(existingReporting.isArchived).isEqualTo(false)
        // When
        jpaReportingRepository.archiveOutdatedReportings()
        // Then
        val archivedReporting = jpaReportingRepository.findById(1)
        assertThat(archivedReporting.isArchived).isEqualTo(true)

    }
}
