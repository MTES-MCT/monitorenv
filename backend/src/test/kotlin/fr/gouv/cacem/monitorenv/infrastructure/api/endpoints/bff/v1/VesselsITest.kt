package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.GetVesselByShipId
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.SaveVesselAdditionalInformation
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.SaveVesselFiles
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.SearchVessels
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures.VesselFixture.Companion.aVessel
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures.VesselFixture.Companion.aVesselAdditionalInformation
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures.VesselFixture.Companion.aVesselFile
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vessel.VesselFileDataInput
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.json.JsonMapper

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(Vessels::class)])
class VesselsITest {
    @Autowired
    private lateinit var api: MockMvc

    @MockitoBean
    private lateinit var getVesselByShipId: GetVesselByShipId

    @MockitoBean
    private lateinit var searchVessels: SearchVessels

    @MockitoBean
    private lateinit var saveVesselAdditionalInformation: SaveVesselAdditionalInformation

    @MockitoBean
    private lateinit var saveVesselFiles: SaveVesselFiles

    @Autowired
    private lateinit var jsonMapper: JsonMapper

    @Test
    fun `Should search for a vessel`() {
        // Given
        val vessel = aVessel()
        given(searchVessels.execute(any())).willReturn(listOf(vessel))

        // When
        api
            .perform(get("/bff/v1/vessels/search").param("searched", "VESSEL"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()", equalTo(1)))
            .andExpect(jsonPath("$[0].id", equalTo(vessel.id)))
            .andExpect(jsonPath("$[0].shipId", equalTo(vessel.shipId)))
            .andExpect(jsonPath("$[0].batchId", equalTo(vessel.batchId)))
            .andExpect(jsonPath("$[0].rowNumber", equalTo(vessel.rowNumber)))
            .andExpect(jsonPath("$[0].flag", equalTo(vessel.flag)))
            .andExpect(jsonPath("$[0].mmsi", equalTo(vessel.mmsi)))
            .andExpect(jsonPath("$[0].imo", equalTo(vessel.imo)))
            .andExpect(jsonPath("$[0].immatriculation", equalTo(vessel.immatriculation)))
            .andExpect(jsonPath("$[0].shipName", equalTo(vessel.shipName)))

        Mockito.verify(searchVessels).execute("VESSEL")
    }

    @Test
    fun `Should find a vessel by its id`() {
        // Given
        val id = 1
        val vessel = aVessel()
        given(
            getVesselByShipId.execute(
                any(),
                any(),
                any(),
            ),
        ).willReturn(vessel)

        // When
        api
            .perform(get("/bff/v1/vessels/$id").param("batchId", "1").param("rowNumber", "1"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(vessel.id)))
            .andExpect(jsonPath("$.status", equalTo(vessel.status)))
            .andExpect(jsonPath("$.category", equalTo(vessel.category)))
            .andExpect(jsonPath("$.imo", equalTo(vessel.imo)))
            .andExpect(jsonPath("$.mmsi", equalTo(vessel.mmsi)))
            .andExpect(jsonPath("$.immatriculation", equalTo(vessel.immatriculation)))
            .andExpect(jsonPath("$.shipName", equalTo(vessel.shipName)))
            .andExpect(jsonPath("$.flag", equalTo(vessel.flag)))
            .andExpect(jsonPath("$.portOfRegistry", equalTo(vessel.portOfRegistry)))
            .andExpect(jsonPath("$.professionalType", equalTo(vessel.professionalType)))
            .andExpect(jsonPath("$.commercialName", equalTo(vessel.commercialName)))
            .andExpect(jsonPath("$.length", equalTo(vessel.length)))
            .andExpect(jsonPath("$.ownerLastName", equalTo(vessel.ownerLastName)))
            .andExpect(jsonPath("$.ownerFirstName", equalTo(vessel.ownerFirstName)))
            .andExpect(jsonPath("$.ownerDateOfBirth", equalTo(vessel.ownerDateOfBirth)))
            .andExpect(jsonPath("$.ownerPostalAddress", equalTo(vessel.ownerPostalAddress)))
            .andExpect(jsonPath("$.ownerPhone", equalTo(vessel.ownerPhone)))
            .andExpect(jsonPath("$.ownerEmail", equalTo(vessel.ownerEmail)))
            .andExpect(jsonPath("$.ownerCompanyName", equalTo(vessel.ownerCompanyName)))
            .andExpect(jsonPath("$.ownerNationality", equalTo(vessel.ownerNationality)))
            .andExpect(jsonPath("$.ownerBusinessSegmentLabel", equalTo(vessel.ownerBusinessSegmentLabel)))
            .andExpect(jsonPath("$.ownerLegalStatusLabel", equalTo(vessel.ownerLegalStatusLabel)))
            .andExpect(jsonPath("$.ownerStartDate", equalTo(vessel.ownerStartDate)))
            .andExpect(jsonPath("$.batchId", equalTo(vessel.batchId)))
            .andExpect(jsonPath("$.rowNumber", equalTo(vessel.rowNumber)))
    }

    @Test
    fun `Should return 404 when vessel is not found`() {
        // Given
        val id = 1
        given(
            getVesselByShipId.execute(
                any(),
                any(),
                any(),
            ),
        ).willThrow(BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND))

        // When
        api
            .perform(get("/bff/v1/vessels/$id"))
            // Then
            .andExpect(status().isNotFound)
    }

    @Test
    fun `Should save a vessel additional information`() {
        // Given
        val vesselAdditionalInformation = aVesselAdditionalInformation()
        given(saveVesselAdditionalInformation.execute(any(), any())).willReturn(vesselAdditionalInformation)

        // When
        api
            .perform(
                put("/bff/v1/vessels/additional_information")
                    .content(jsonMapper.writeValueAsString(vesselAdditionalInformation))
                    .contentType(MediaType.APPLICATION_JSON)
                    .param("shipId", "3")
                    .param("batchId", "1")
                    .param("rowNumber", "2"),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(vesselAdditionalInformation.id)))
            .andExpect(jsonPath("$.observations", equalTo(vesselAdditionalInformation.observations)))
    }

    @Test
    fun `Should save a vessel files`() {
        val vesselFiles = listOf(aVesselFile())
        given(
            saveVesselFiles.execute(any(), any()),
        ).willReturn(vesselFiles)

        // When
        api
            .perform(
                put("/bff/v1/vessels/files")
                    .content(
                        jsonMapper.writeValueAsString(
                            listOf(
                                VesselFileDataInput(
                                    id = 1,
                                    content = "TEST".toByteArray(),
                                    mimeType = "images/jpeg",
                                    name = "fichier1",
                                    size = 1024,
                                ),
                            ),
                        ),
                    ).contentType(MediaType.APPLICATION_JSON)
                    .param("shipId", "123")
                    .param("batchId", "1")
                    .param("rowNumber", "2"),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(1)))
    }
}
