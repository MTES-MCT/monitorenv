package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlPlanTheme.ControlPlanThemeEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlPlanThemes.GetControlPlanThemesByYear
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(WebSecurityConfig::class)
@WebMvcTest(value = [(ControlPlanThemesController::class)])
class ControlPlanThemesControllerITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getControlPlanThemesByYear: GetControlPlanThemesByYear

    @Test
    fun `Should get all control plan themes`() {
        // Given
        val controlPlanTheme = ControlPlanThemeEntity(
            id = 1,
            theme = "Theme Police des mouillages",
            subTheme = "Sous Theme Mouillage individuel",
            allowedTags = listOf("tag1", "tag2"),
            year = 2024,
        )
        BDDMockito.given(getControlPlanThemesByYear.execute(2024)).willReturn(listOf(controlPlanTheme))
        // When
        mockMvc.perform(get("/bff/v1/controlplanthemes/2024"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value(controlPlanTheme.id))
            .andExpect(jsonPath("$[0].theme").value(controlPlanTheme.theme))
            .andExpect(jsonPath("$[0].subTheme").value(controlPlanTheme.subTheme))
            .andExpect(jsonPath("$[0].year").value(controlPlanTheme.year))
            .andExpect(jsonPath("$[0].allowedTags[0]").value(controlPlanTheme.allowedTags?.get(0)))
            .andExpect(jsonPath("$[0].allowedTags[1]").value(controlPlanTheme.allowedTags?.get(1)))

        verify(getControlPlanThemesByYear).execute(2024)
    }
}
