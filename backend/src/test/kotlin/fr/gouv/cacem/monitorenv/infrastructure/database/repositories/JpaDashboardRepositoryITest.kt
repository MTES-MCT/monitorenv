package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures.DashboardFixture.Companion.aBriefing
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures.DashboardFixture.Companion.aDashboard
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaDashboardRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaDashboardRepository: JpaDashboardRepository

    @Test
    fun `save should save a dashboard without briefing and return saved entity when dashboard doesnt exist`() {
        // Given
        val dashboard = aDashboard()

        // When
        val savedDashboard = jpaDashboardRepository.save(dashboard)

        // Then
        assertThat(savedDashboard.id).isNotNull()
        assertThat(savedDashboard.briefings).isEmpty()
    }

    @Test
    fun `save should update a dashboard and return saved entity when dashboard exist`() {
        // Given
        val dashboard = aDashboard()
        val createdDashboard = jpaDashboardRepository.save(dashboard)

        // When
        val updatedDashboard = jpaDashboardRepository.save(createdDashboard)

        // Then
        assertThat(updatedDashboard.id).isEqualTo(createdDashboard.id)
        assertThat(updatedDashboard.briefings).isEmpty()
    }

    @Test
    fun `save should save a dashboard with briefings and return saved entity when dashboard doesnt exist`() {
        // Given
        val briefings = listOf(aBriefing())
        val dashboard = aDashboard(briefings = briefings)

        // When
        val savedDashboard = jpaDashboardRepository.save(dashboard)

        // Then
        assertThat(savedDashboard.id).isNotNull()
        assertThat(savedDashboard.briefings).hasSameSizeAs(briefings)
        savedDashboard.briefings.forEach { assertThat(it.id).isNotNull() }
    }

    @Test
    fun `save should update a dashboard with briefings and return saved entity when dashboard exist`() {
        // Given
        val briefings = listOf(aBriefing())
        val dashboard = aDashboard(briefings = briefings)
        val createdDashboard = jpaDashboardRepository.save(dashboard)

        // When
        val updatedDashboard = jpaDashboardRepository.save(createdDashboard)

        // Then
        assertThat(updatedDashboard.id).isEqualTo(createdDashboard.id)
        assertThat(updatedDashboard.briefings).hasSameSizeAs(createdDashboard.briefings)
        assertThat(updatedDashboard.briefings).usingRecursiveComparison().isEqualTo(createdDashboard.briefings)
    }
}
