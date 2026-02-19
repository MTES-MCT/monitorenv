package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.station.CanDeleteStation
import fr.gouv.cacem.monitorenv.domain.use_cases.station.CreateOrUpdateStation
import fr.gouv.cacem.monitorenv.domain.use_cases.station.DeleteStation
import fr.gouv.cacem.monitorenv.domain.use_cases.station.GetStationById
import fr.gouv.cacem.monitorenv.domain.use_cases.station.GetStations
import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateStationDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.ApiStationsController
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito
import org.mockito.BDDMockito.given
import org.mockito.Mockito.mock
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.json.JsonMapper

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(ApiStationsController::class)])
class ApiStationsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private val canDeleteStation: CanDeleteStation = mock()

    @MockitoBean
    private val createOrUpdateStation: CreateOrUpdateStation = mock()

    @MockitoBean
    private val deleteStation: DeleteStation = mock()

    @MockitoBean
    private val getStationById: GetStationById = mock()

    @MockitoBean
    private val getstations: GetStations = mock()

    @Autowired
    private lateinit var jsonMapper: JsonMapper

    @Test
    fun `canDelete() should check if a base can be deleted`() {
        val stationId = 1

        given(canDeleteStation.execute(stationId)).willReturn(true)

        mockMvc
            .perform(get("/api/v1/stations/$stationId/can_delete"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.value").value(true))

        BDDMockito.verify(canDeleteStation).execute(stationId)
    }

    @Test
    fun `create() should create a base`() {
        val expectedCreatedStation =
            StationEntity(
                id = 1,
                latitude = 0.0,
                longitude = 0.0,
                name = "Station Name",
            )

        val newStationData =
            CreateOrUpdateStationDataInput(
                latitude = 0.0,
                longitude = 0.0,
                name = "Station Name",
            )
        val requestBody = jsonMapper.writeValueAsString(newStationData)

        given(createOrUpdateStation.execute(station = any())).willReturn(expectedCreatedStation)

        mockMvc
            .perform(
                post("/api/v1/stations")
                    .content(requestBody)
                    .contentType(MediaType.APPLICATION_JSON),
            ).andDo(MockMvcResultHandlers.print())
            .andExpect(status().isCreated)
    }

    @Test
    fun `delete() should delete a base`() {
        val stationId = 1

        mockMvc
            .perform(
                delete("/api/v1/stations/$stationId"),
            ).andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)

        BDDMockito.verify(deleteStation).execute(stationId)
    }

    @Test
    fun `get() should get a base by its ID`() {
        val expectedFullStation =
            FullStationDTO(
                controlUnitResources = listOf(),
                station =
                    StationEntity(
                        id = 1,
                        latitude = 0.0,
                        longitude = 0.0,
                        name = "Station Name",
                    ),
            )

        val requestedId = 1

        given(getStationById.execute(requestedId)).willReturn(expectedFullStation)

        mockMvc
            .perform(get("/api/v1/stations/$requestedId"))
            .andExpect(status().isOk)

        BDDMockito.verify(getStationById).execute(requestedId)
    }

    @Test
    fun `getAll() should get all bases`() {
        val expectedFullStations =
            listOf(
                FullStationDTO(
                    controlUnitResources = listOf(),
                    station =
                        StationEntity(
                            id = 1,
                            latitude = 0.0,
                            longitude = 0.0,
                            name = "Station Name",
                        ),
                ),
                FullStationDTO(
                    controlUnitResources = listOf(),
                    station =
                        StationEntity(
                            id = 2,
                            latitude = 0.0,
                            longitude = 0.0,
                            name = "Station Name 2",
                        ),
                ),
            )

        given(getstations.execute()).willReturn(expectedFullStations)

        mockMvc
            .perform(get("/api/v1/stations"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize<Any>(2)))

        BDDMockito.verify(getstations).execute()
    }

    @Test
    fun `update() should update a base`() {
        val expectedUpdatedStation =
            StationEntity(
                id = 1,
                latitude = 0.0,
                longitude = 0.0,
                name = "Updated Station Name",
            )

        val nextStationData =
            CreateOrUpdateStationDataInput(
                id = 1,
                latitude = 0.0,
                longitude = 0.0,
                name = "Updated Station Name",
            )
        val requestBody = jsonMapper.writeValueAsString(nextStationData)

        given(createOrUpdateStation.execute(station = any())).willReturn(expectedUpdatedStation)

        mockMvc
            .perform(
                put("/api/v1/stations/1")
                    .content(requestBody)
                    .contentType(MediaType.APPLICATION_JSON),
            ).andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }
}
