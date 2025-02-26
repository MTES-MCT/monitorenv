package fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class GetRecentControlsActivityUTest {
    private val envActionRepository: IEnvActionRepository = mock()
    private val getRecentControlsActivity = GetRecentControlsActivity(envActionRepository)

    @Test
    fun `execute should return recent controls activity`() {
        val now = ZonedDateTime.now()
        // Given
        val expectedRecentControlsActivity =
            listOf(RecentControlsActivityListDTOFixture.aRecentControlsActivityListDTO())

        given(
            envActionRepository.getRecentControlsActivity(
                administrationIds = listOf(1),
                controlUnitIds = listOf(1),
                geometry = null,
                infractionsStatus = null,
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
                infractionsStatus = null,
                themeIds = listOf(8),
                startedAfter = now.minusDays(30),
                startedBefore = now,
            )
        
        // Then
        assertThat(expectedRecentControlsActivity).isEqualTo(recentControlsActivity)
    }
}
