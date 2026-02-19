package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.GetRecentControlsActivity
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.recentActivity.RecentControlsActivityDataInput
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.json.JsonMapper
import java.time.ZonedDateTime
import java.util.UUID

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(RecentActivity::class)])
class RecentActivityITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var jsonMapper: JsonMapper

    @MockitoBean
    private lateinit var getRecentControlsActivity: GetRecentControlsActivity

    private val point = WKTReader().read("POINT (-4.54877816747593 48.305559876971)") as Point

    @Test
    fun `Should get all controls`() {
        // Given

        val controls =
            RecentControlsActivityListDTO(
                id = UUID.fromString("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b"),
                actionStartDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                themesIds = listOf(1),
                subThemesIds = listOf(1, 2),
                geom = point,
                facade = "Outre-Mer",
                department = "29",
                missionId = 1,
                observations = "Observations de l'action de contrôle",
                actionNumberOfControls = 2,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VEHICLE_LAND,
                infractions = TestUtils.getControlInfraction(),
                administrationIds = listOf(1),
                controlUnitsIds = listOf(1, 2),
            )

        val request =
            RecentControlsActivityDataInput(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z"),
                startedBefore = ZonedDateTime.parse("2050-08-08T00:00:00Z"),
                controlUnitIds = null,
                administrationIds = null,
                themeIds = null,
                geometry = null,
            )

        given(
            getRecentControlsActivity.execute(
                startedAfter = request.startedAfter,
                startedBefore = request.startedBefore,
                controlUnitIds = request.controlUnitIds,
                administrationIds = request.administrationIds,
                themeIds = request.themeIds,
                geometry = request.geometry,
            ),
        ).willReturn(listOf(controls))

        // When

        mockMvc
            .perform(
                post("/bff/v1/recent-activity/controls")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        jsonMapper.writeValueAsString(
                            request,
                        ),
                    ),
            )
            // Then
            .andExpect(status().isOk)
            .andDo(MockMvcResultHandlers.print())
            .andExpect(jsonPath("$[0].id", equalTo("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b")))
            .andExpect(jsonPath("$[0].actionStartDateTimeUtc", equalTo("2022-01-15T04:50:09Z")))
            .andExpect(jsonPath("$[0].actionNumberOfControls", equalTo(2)))
            .andExpect(jsonPath("$[0].themeIds[0]", equalTo(1)))
            .andExpect(jsonPath("$[0].subThemeIds[0]", equalTo(1)))
            .andExpect(jsonPath("$[0].subThemeIds[1]", equalTo(2)))
            .andExpect(jsonPath("$[0].facade", equalTo("Outre-Mer")))
            .andExpect(jsonPath("$[0].department", equalTo("29")))
            .andExpect(jsonPath("$[0].missionId", equalTo(1)))
            .andExpect(
                jsonPath(
                    "$[0].observations",
                    equalTo("Observations de l'action de contrôle"),
                ),
            ).andExpect(jsonPath("$[0].actionNumberOfControls", equalTo(2)))
            .andExpect(jsonPath("$[0].actionTargetType", equalTo("VEHICLE")))
            .andExpect(jsonPath("$[0].vehicleType", equalTo("VEHICLE_LAND")))
            .andExpect(
                jsonPath(
                    "$[0].infractions[0].id",
                    equalTo("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b"),
                ),
            ).andExpect(jsonPath("$[0].administrationIds[0]", equalTo(1)))
            .andExpect(jsonPath("$[0].controlUnitIds[0]", equalTo(1)))
            .andExpect(jsonPath("$[0].controlUnitIds[1]", equalTo(2)))
    }
}
