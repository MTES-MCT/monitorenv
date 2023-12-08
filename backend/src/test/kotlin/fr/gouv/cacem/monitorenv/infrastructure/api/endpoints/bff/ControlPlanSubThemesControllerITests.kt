package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlPlanSubTheme.ControlPlanSubThemeEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlPlan.GetControlPlansByYear
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
@WebMvcTest(value = [(ControlPlanSubThemesController::class)])
class ControlPlanSubThemesControllerITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getControlPlansByYear: GetControlPlansByYear

    @Test
    fun `Should get all control plan themes`() {
        // Given
        val ControlPlanSubTheme = ControlPlanSubThemeEntity(
            id = 1,
            theme = "Theme Police des mouillages",
            subTheme = "Sous Theme Mouillage individuel",
            allowedTags = listOf("tag1", "tag2"),
            year = 2024,
        )
        BDDMockito.given(getControlPlansByYear.execute(2024)).willReturn(listOf(ControlPlanSubTheme))
        // When
        mockMvc.perform(get("/bff/v1/controlPlanSubThemes/2024"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value(ControlPlanSubTheme.id))
            .andExpect(jsonPath("$[0].theme").value(ControlPlanSubTheme.theme))
            .andExpect(jsonPath("$[0].subTheme").value(ControlPlanSubTheme.subTheme))
            .andExpect(jsonPath("$[0].year").value(ControlPlanSubTheme.year))
            .andExpect(jsonPath("$[0].allowedTags[0]").value(ControlPlanSubTheme.allowedTags?.get(0)))
            .andExpect(jsonPath("$[0].allowedTags[1]").value(ControlPlanSubTheme.allowedTags?.get(1)))

        verify(getControlPlansByYear).execute(2024)
    }
}
