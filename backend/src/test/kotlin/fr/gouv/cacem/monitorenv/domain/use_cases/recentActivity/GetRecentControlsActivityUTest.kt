package fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.within
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentCaptor
import org.mockito.Captor
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.Duration
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class GetRecentControlsActivityUTest {
    private val envActionRepository: IEnvActionRepository = mock()
    private val getRecentControlsActivity = GetRecentControlsActivity(envActionRepository)

    @Captor private lateinit var startedAfterCaptor: ArgumentCaptor<java.time.Instant>

    @Captor private lateinit var startedBeforeCaptor: ArgumentCaptor<java.time.Instant>

    @BeforeEach
    fun setup() {
        startedAfterCaptor = ArgumentCaptor.forClass(java.time.Instant::class.java)
        startedBeforeCaptor = ArgumentCaptor.forClass(java.time.Instant::class.java)
    }

    @Test
    fun `execute should return recent controls activity with default filter `() {
        // Given
        val expectedRecentControlsActivity =
            listOf(RecentControlsActivityListDTOFixture.aRecentControlsActivityListDTO())

        whenever(
            envActionRepository.getRecentControlsActivity(
                anyOrNull(),
                anyOrNull(),
                anyOrNull(),
                anyOrNull(),
                any(),
                any(),
            ),
        ).thenReturn(expectedRecentControlsActivity)

        // When
        val now = ZonedDateTime.now()
        val expectedStartedAfter = now.minusDays(30).toInstant()
        val expectedStartedBefore = now.toInstant()

        val recentControlsActivity =
            getRecentControlsActivity.execute(
                administrationIds = null,
                controlUnitIds = null,
                geometry = null,
                themeIds = null,
                startedAfter = null,
                startedBefore = null,
            )

        // Then
        verify(envActionRepository)
            .getRecentControlsActivity(
                anyOrNull(),
                anyOrNull(),
                anyOrNull(),
                anyOrNull(),
                capture(startedAfterCaptor),
                capture(startedBeforeCaptor),
            )

        assertThat(startedAfterCaptor.value)
            .isCloseTo(expectedStartedAfter, within(Duration.ofSeconds(1)))
        assertThat(startedBeforeCaptor.value)
            .isCloseTo(expectedStartedBefore, within(Duration.ofSeconds(1)))
        assertThat(expectedRecentControlsActivity).isEqualTo(recentControlsActivity)
    }

    @Test
    fun `execute should return recent controls activity with filters`() {
        val now = ZonedDateTime.now()
        // Given
        val expectedRecentControlsActivity =
            listOf(RecentControlsActivityListDTOFixture.aRecentControlsActivityListDTO())

        given(
            envActionRepository.getRecentControlsActivity(
                administrationIds = listOf(1),
                controlUnitIds = listOf(1),
                geometry = null,
                themeIds = listOf(8),
                startedAfter = now.minusDays(30).toInstant(),
                startedBefore = now.toInstant(),
            ),
        ).willReturn(expectedRecentControlsActivity)

        // When
        val recentControlsActivity =
            getRecentControlsActivity.execute(
                administrationIds = listOf(1),
                controlUnitIds = listOf(1),
                geometry = null,
                themeIds = listOf(8),
                startedAfter = now.minusDays(30),
                startedBefore = now,
            )

        // Then
        assertThat(expectedRecentControlsActivity).isEqualTo(recentControlsActivity)
    }
}
