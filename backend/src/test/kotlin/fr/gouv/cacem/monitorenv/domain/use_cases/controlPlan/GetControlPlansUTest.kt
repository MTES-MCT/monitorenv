package fr.gouv.cacem.monitorenv.domain.use_cases.controlPlan

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanSubThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanTagEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanSubThemeRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanTagRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanThemeRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class GetControlPlansUTest {
    @Mock
    private val controlPlanSubThemeRepository: IControlPlanSubThemeRepository = mock()

    @Mock
    private val controlPlanThemeRepository: IControlPlanThemeRepository = mock()

    @Mock
    private val controlPlanTagRepository: IControlPlanTagRepository = mock()

    @Test
    fun `execute should return all ControlPlanThemes, ControlPlanSubThemes and ControlPlanTags`(log: CapturedOutput) {
        val controlPlanThemes =
            listOf(
                ControlPlanThemeEntity(
                    id = 1,
                    theme = "ControlPlanTheme Name",
                ),
                ControlPlanThemeEntity(
                    id = 2,
                    theme = "ControlPlanTheme Name 2",
                ),
            )
        val controlPlanSubThemes =
            listOf(
                ControlPlanSubThemeEntity(
                    id = 1,
                    themeId = 1,
                    subTheme = "ControlPlanSubTheme Name",
                    year = 2023,
                ),
                ControlPlanSubThemeEntity(
                    id = 2,
                    themeId = 1,
                    subTheme = "ControlPlanSubTheme Name 2",
                    year = 2023,
                ),
            )
        val controlPlanTags =
            listOf(
                ControlPlanTagEntity(
                    id = 1,
                    tag = "ControlPlanTag Name",
                    themeId = 1,
                ),
                ControlPlanTagEntity(
                    id = 2,
                    tag = "ControlPlanTag Name 2",
                    themeId = 2,
                ),
            )

        given(controlPlanThemeRepository.findAll()).willReturn(controlPlanThemes)
        given(controlPlanSubThemeRepository.findAll()).willReturn(controlPlanSubThemes)
        given(controlPlanTagRepository.findAll()).willReturn(controlPlanTags)

        val result =
            GetControlPlans(
                controlPlanThemeRepository = controlPlanThemeRepository,
                controlPlanSubThemeRepository = controlPlanSubThemeRepository,
                controlPlanTagRepository = controlPlanTagRepository,
            ).execute()

        assertThat(result.first).isEqualTo(controlPlanThemes)
        assertThat(result.second).isEqualTo(controlPlanSubThemes)
        assertThat(result.third).isEqualTo(controlPlanTags)
        assertThat(log.out).contains("Attempt to GET all control plans")
        assertThat(
            log.out,
        ).contains(
            "Found ${controlPlanThemes.size} control plan themes, ${controlPlanSubThemes.size} control plan subthemes and ${controlPlanTags.size} control plan tags",
        )
    }
}
