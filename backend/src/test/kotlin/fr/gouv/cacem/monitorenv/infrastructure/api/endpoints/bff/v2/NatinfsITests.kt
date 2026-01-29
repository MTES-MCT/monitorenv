package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v2

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.natinf.v1.RefNatinfEntity
import fr.gouv.cacem.monitorenv.domain.entities.natinf.v2.NatinfEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.natinfs.SaveNatinf
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.natinfs.NatinfInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.natinfs.RefNatinfInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.themes.ThemeInput
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(Natinfs::class)])
class NatinfsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var saveNatinf: SaveNatinf

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `should create a new natinf`() {
        // Given
        val natinfInput =
            NatinfInput(
                refNatinf =
                    RefNatinfInput(
                        id = 1,
                        nature = "ABC",
                        qualification = "A1234BC",
                        definedBy = "defined",
                        repressedBy = null,
                    ),
                themes = listOf(ThemeInput(id = 1, name = "theme", startedAt = null, endedAt = null)),
            )

        val natinf =
            NatinfEntity(
                refNatinf =
                    RefNatinfEntity(
                        id = 1,
                        nature = "ABC",
                        qualification = "A1234BC",
                        definedBy = "defined",
                        repressedBy = null,
                    ),
                themes =
                    listOf(
                        ThemeEntity(id = 1, name = "theme", startedAt = null, endedAt = null, subThemes = listOf()),
                    ),
            )
        given(saveNatinf.execute(natinf)).willReturn(natinf)

        // When
        mockMvc
            .perform(
                put("/bff/v2/natinfs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(natinfInput)),
            )
            // Then
            .andExpect(status().isOk)
    }
}
