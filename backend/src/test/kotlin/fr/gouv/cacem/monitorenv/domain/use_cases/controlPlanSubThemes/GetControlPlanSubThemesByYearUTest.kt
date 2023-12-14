package fr.gouv.cacem.monitorenv.domain.use_cases.controlPlanSubThemes

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.controlPlanSubTheme.ControlPlanSubThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanSubThemeRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class GetControlPlanSubThemesByYearUTest {
    @MockBean
    private lateinit var controlPlanSubThemeRepository: IControlPlanSubThemeRepository

    fun `execute should return all ControlPlanSubThemes for the given year`() {
        val controlPlanSubThemes = listOf(
            ControlPlanSubThemeEntity(
                id = 1,
                theme = "ControlPlanTheme Name",
                subTheme = "ControlPlanSubTheme Name",
                allowedTags = listOf("tag1", "tag2"),
                year = 2023,
            ),
            ControlPlanSubThemeEntity(
                id = 2,
                theme = "ControlPlanTheme Name 2",
                subTheme = "ControlPlanSubTheme Name 2",
                allowedTags = null,
                year = 2023,
            ),
        )

        given(controlPlanSubThemeRepository.findByYear(2023)).willReturn(controlPlanSubThemes)

        val result = GetControlPlanSubThemesByYear(controlPlanSubThemeRepository).execute(2023)

        assertThat(result.size).isEqualTo(2)
        assertThat(result).isEqualTo(controlPlanSubThemes)
    }
}
