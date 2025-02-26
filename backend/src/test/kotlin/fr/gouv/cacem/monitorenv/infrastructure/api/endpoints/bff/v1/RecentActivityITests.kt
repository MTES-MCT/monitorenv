package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.fasterxml.jackson.databind.ObjectMapper
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
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime
import java.util.*

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(RecentActivity::class)])
class RecentActivityITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

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
                infractionsStatus = null,
                controlUnitIds = null,
                administrationIds = null,
                themeIds = null,
                geometry = null,
            )
        val wktReader = WKTReader()
        val geometry = request.geometry?.let { wktReader.read(it) }

        given(
            getRecentControlsActivity.execute(
                startedAfter = request.startedAfter,
                startedBefore = request.startedBefore,
                infractionsStatus = request.infractionsStatus,
                controlUnitIds = request.controlUnitIds,
                administrationIds = request.administrationIds,
                themeIds = request.themeIds,
                geometry = geometry,
            ),
        ).willReturn(listOf(controls))

        // When

        mockMvc.perform(
            post("/bff/v1/recent-activity/controls")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        request,
                    ),
                ),
        )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b")))
    }
}
