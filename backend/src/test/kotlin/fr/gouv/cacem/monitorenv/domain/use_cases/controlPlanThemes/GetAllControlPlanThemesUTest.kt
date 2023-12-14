package fr.gouv.cacem.monitorenv.domain.use_cases.controlPlanThemes

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.controlPlanTheme.ControlPlanThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanThemeRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class GetAllControlPlanThemesUTest {
    @MockBean
    private lateinit var controlPlanThemeRepository: IControlPlanThemeRepository

    fun `execute should return all controlPlanThemes for the given year`() {
        val controlPlanThemes = listOf(
            ControlPlanThemeEntity(
                id = 1,
                theme = "ControlPlanTheme Name",
                subTheme = "ControlPlanTheme Name",
                allowedTags = listOf("tag1", "tag2"),
                year = 2023,
            ),
            ControlPlanThemeEntity(
                id = 2,
                theme = "ControlPlanTheme Name 2",
                subTheme = "ControlPlanTheme Name 2",
                allowedTags = null,
                year = 2023,
            ),
        )

        given(controlPlanThemeRepository.findByYear(2023)).willReturn(controlPlanThemes)

        val result = GetControlPlanThemesByYear(controlPlanThemeRepository).execute(2023)

        assertThat(result.size).isEqualTo(2)
        assertThat(result).isEqualTo(controlPlanThemes)
    }
}
