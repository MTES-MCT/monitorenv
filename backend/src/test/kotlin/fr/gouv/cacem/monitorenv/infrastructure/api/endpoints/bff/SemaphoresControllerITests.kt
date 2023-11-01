package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.semaphores.GetAllSemaphores
import fr.gouv.cacem.monitorenv.domain.use_cases.semaphores.GetSemaphoreById
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(WebSecurityConfig::class, MapperConfiguration::class)
@WebMvcTest(value = [(SemaphoresController::class)])
class SemaphoresControllerITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getAllSemaphores: GetAllSemaphores

    @MockBean
    private lateinit var getSemaphoreById: GetSemaphoreById

    @Test
    fun `Should get all semaphores`() {
        // Given
        val wktReader = WKTReader()
        val pointString = "POINT (-4.54877816747593 48.305559876971)"
        val point = wktReader.read(pointString) as Point
        val semaphore = SemaphoreEntity(
            id = 1,
            name = "Semaphore 1",
            geom = point
        )
        given(getAllSemaphores.execute()).willReturn(listOf(semaphore))
        // When
        mockMvc.perform(get("/bff/v1/semaphores"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(semaphore.id)))
            .andExpect(jsonPath("$[0].name", equalTo(semaphore.name)))
            .andExpect(jsonPath("$[0].geom.type", equalTo("Point")))
            .andExpect(jsonPath("$[0].geom.coordinates.[0]", equalTo(-4.54877817)))
            .andExpect(jsonPath("$[0].geom.coordinates.[1]", equalTo(48.30555988)))
    }

    @Test
    fun `Should get specific semaphore`() {
        // Given
        val wktReader = WKTReader()
        val pointString = "POINT (-4.54877816747593 48.305559876971)"
        val point = wktReader.read(pointString) as Point
        val semaphore = SemaphoreEntity(
            id = 21,
            name = "Semaphore 1",
            geom = point
        )
        given(getSemaphoreById.execute(21)).willReturn(semaphore)
        // When
        mockMvc.perform(get("/bff/v1/semaphores/21"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(semaphore.id)))
            .andExpect(jsonPath("$.name", equalTo(semaphore.name)))
            .andExpect(jsonPath("$.geom.type", equalTo("Point")))
            .andExpect(jsonPath("$.geom.coordinates.[0]", equalTo(-4.54877817)))
            .andExpect(jsonPath("$.geom.coordinates.[1]", equalTo(48.30555988)))
    }
}
