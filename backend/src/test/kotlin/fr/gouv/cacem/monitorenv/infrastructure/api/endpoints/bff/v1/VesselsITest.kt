package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.GetVesselById
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.SearchVessels
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures.VesselFixture.Companion.aVessel
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(Vessels::class)])
class VesselsITest {
    @Autowired
    private lateinit var api: MockMvc

    @MockitoBean
    private lateinit var getVesselById: GetVesselById

    @MockitoBean
    private lateinit var searchVessels: SearchVessels

    @Test
    fun `Should search for a vessel`() {
        // Given
        val vessel = aVessel()
        given(this.searchVessels.execute(any())).willReturn(listOf(vessel))

        // When
        api
            .perform(get("/bff/v1/vessels/search?searched=VESSEL"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()", equalTo(1)))
            .andExpect(jsonPath("$[0].id", equalTo(vessel.id)))
            .andExpect(jsonPath("$[0].flag", equalTo(vessel.flag)))
            .andExpect(jsonPath("$[0].mmsi", equalTo(vessel.mmsi)))
            .andExpect(jsonPath("$[0].imo", equalTo(vessel.imo)))
            .andExpect(jsonPath("$[0].immatriculation", equalTo(vessel.immatriculation)))
            .andExpect(jsonPath("$[0].shipId", equalTo(vessel.shipId)))
            .andExpect(jsonPath("$[0].shipName", equalTo(vessel.shipName)))

        Mockito.verify(searchVessels).execute("VESSEL")
    }

    @Test
    fun `Should find a vessel byt its id`() {
        // Given
        val id = 1
        val vessel = aVessel()
        given(getVesselById.execute(id)).willReturn(vessel)

        // When
        api
            .perform(get("/bff/v1/vessels/$id"))
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
            .andExpect(jsonPath("$.ownerBusinessSegment", equalTo(vessel.ownerBusinessSegment)))
            .andExpect(jsonPath("$.ownerLegalStatus", equalTo(vessel.ownerLegalStatus)))
            .andExpect(jsonPath("$.ownerStartDate", equalTo(vessel.ownerStartDate)))
    }

    @Test
    fun `Should return 404 when vessel is not found`() {
        // Given
        val id = 1
        val vessel = aVessel()
        given(getVesselById.execute(id)).willThrow(BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND))

        // When
        api
            .perform(get("/bff/v1/vessels/$id"))
            // Then
            .andExpect(status().isNotFound)
    }
}
