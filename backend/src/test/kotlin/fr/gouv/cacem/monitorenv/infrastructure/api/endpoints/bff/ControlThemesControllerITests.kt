package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlThemes.ControlThemeEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlThemes.GetControlThemeById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlThemes.GetControlThemes
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(WebSecurityConfig::class)
@WebMvcTest(value = [(ControlThemesController::class)])
class ControlThemesControllerITests {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getControlThemes: GetControlThemes

    @MockBean
    private lateinit var getControlThemeById: GetControlThemeById

    @Test
    fun `Should get all control themes`() {
        // Given

        val controlTheme = ControlThemeEntity(
            id = 1,
            themeLevel1 = "Police des mouillages",
            themeLevel2 = "Mouillage individuel",
        )
        given(getControlThemes.execute()).willReturn(listOf(controlTheme))

        // When
        mockMvc.perform(get("/bff/v1/controlthemes"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(controlTheme.id)))
            .andExpect(jsonPath("$[0].themeLevel1", equalTo(controlTheme.themeLevel1)))
            .andExpect(jsonPath("$[0].themeLevel2", equalTo(controlTheme.themeLevel2)))
    }

    @Test
    fun `Should get specific control theme when requested by Id`() {
        // Given

        val controlTheme = ControlThemeEntity(
            id = 1,
            themeLevel1 = "Police des mouillages",
            themeLevel2 = "Mouillage individuel",
        )

        given(getControlThemeById.execute(3)).willReturn(controlTheme)

        // When
        mockMvc.perform(get("/bff/v1/controlthemes/3"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(controlTheme.id)))
            .andExpect(jsonPath("$.themeLevel1", equalTo(controlTheme.themeLevel1)))
            .andExpect(jsonPath("$.themeLevel2", equalTo(controlTheme.themeLevel2)))
    }
}
