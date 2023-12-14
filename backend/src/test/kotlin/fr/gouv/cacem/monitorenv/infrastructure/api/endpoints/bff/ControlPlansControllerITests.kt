package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanSubThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanTagEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanThemeEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlPlan.GetControlPlans
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
@WebMvcTest(value = [(ControlPlansController::class)])
class ControlPlansControllerITests {
    @Autowired private lateinit var mockMvc: MockMvc

    @MockBean private lateinit var getControlPlansByYear: GetControlPlansByYear

    @MockBean private lateinit var getControlPlans: GetControlPlans

    @Test
    fun `Should get all control plan themes`() {
        // Given
        val controlPlanTheme1 =
            ControlPlanThemeEntity(
                id = 1,
                theme = "Theme Police des mouillages",
            )
        val controlPlanTheme2 =
            ControlPlanThemeEntity(
                id = 2,
                theme = "Theme Protection des espèces",
            )
        val controlPlanSubTheme1 =
            ControlPlanSubThemeEntity(
                id = 10,
                themeId = 1,
                subTheme = "SubTheme ZMEL",
                year = 2024,
            )
        val controlPlanTag =
            ControlPlanTagEntity(
                id = 100,
                themeId = 2,
                tag = "Tag Bichique",
            )
        val controlPlan =
            Triple(
                listOf(controlPlanTheme1, controlPlanTheme2),
                listOf(controlPlanSubTheme1),
                listOf(controlPlanTag),
            )
        BDDMockito.given(getControlPlans.execute()).willReturn(controlPlan)
        // When
        mockMvc.perform(get("/bff/v1/control_plans/"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.themes[\"1\"].id").value(controlPlanTheme1.id))
            .andExpect(jsonPath("$.themes[\"1\"].id").value(controlPlanTheme1.id))
            .andExpect(jsonPath("$.subThemes[\"10\"].id").value(controlPlanSubTheme1.id))
            .andExpect(
                jsonPath("$.subThemes[\"10\"].subTheme")
                    .value(controlPlanSubTheme1.subTheme),
            )
            .andExpect(
                jsonPath("$.subThemes[\"10\"].themeId").value(controlPlanSubTheme1.themeId),
            )
            .andExpect(jsonPath("$.tags[\"100\"].id").value(controlPlanTag.id))
            .andExpect(jsonPath("$.tags[\"100\"].tag").value(controlPlanTag.tag))
            .andExpect(jsonPath("$.tags[\"100\"].themeId").value(controlPlanTag.themeId))

        verify(getControlPlans).execute()
    }

    @Test
    fun `Should get all control plan themes by year`() {
        // Given
        val controlPlanTheme1 =
            ControlPlanThemeEntity(
                id = 1,
                theme = "Theme Police des mouillages",
            )
        val controlPlanTheme2 =
            ControlPlanThemeEntity(
                id = 2,
                theme = "Theme Protection des espèces",
            )
        val controlPlanSubTheme1 =
            ControlPlanSubThemeEntity(
                id = 10,
                themeId = 1,
                subTheme = "SubTheme ZMEL",
                year = 2024,
            )
        val controlPlanTag =
            ControlPlanTagEntity(
                id = 100,
                themeId = 2,
                tag = "Tag Bichique",
            )
        val controlPlan =
            Triple(
                listOf(controlPlanTheme1, controlPlanTheme2),
                listOf(controlPlanSubTheme1),
                listOf(controlPlanTag),
            )
        BDDMockito.given(getControlPlansByYear.execute(2024)).willReturn(controlPlan)
        // When
        mockMvc.perform(get("/bff/v1/control_plans/2024"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.themes[\"1\"].id").value(controlPlanTheme1.id))
            .andExpect(jsonPath("$.themes[\"1\"].id").value(controlPlanTheme1.id))
            .andExpect(jsonPath("$.subThemes[\"10\"].id").value(controlPlanSubTheme1.id))
            .andExpect(
                jsonPath("$.subThemes[\"10\"].subTheme")
                    .value(controlPlanSubTheme1.subTheme),
            )
            .andExpect(
                jsonPath("$.subThemes[\"10\"].themeId").value(controlPlanSubTheme1.themeId),
            )
            .andExpect(jsonPath("$.tags[\"100\"].id").value(controlPlanTag.id))
            .andExpect(jsonPath("$.tags[\"100\"].tag").value(controlPlanTag.tag))
            .andExpect(jsonPath("$.tags[\"100\"].themeId").value(controlPlanTag.themeId))

        verify(getControlPlansByYear).execute(2024)
    }
}
