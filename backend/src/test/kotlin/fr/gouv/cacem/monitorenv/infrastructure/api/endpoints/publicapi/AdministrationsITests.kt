package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.ArchiveAdministration
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.CanArchiveAdministration
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.CanDeleteAdministration
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.CreateOrUpdateAdministration
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.DeleteAdministration
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.GetAdministrationById
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.GetAdministrations
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateAdministrationDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.Administrations
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito
import org.mockito.BDDMockito.given
import org.mockito.Mockito.mock
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
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

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(Administrations::class)])
class AdministrationsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private val archiveAdministration: ArchiveAdministration = mock()

    @MockitoBean
    private val canArchiveAdministration: CanArchiveAdministration = mock()

    @MockitoBean
    private val canDeleteAdministration: CanDeleteAdministration = mock()

    @MockitoBean
    private val createOrUpdateAdministration: CreateOrUpdateAdministration = mock()

    @MockitoBean
    private val deleteAdministration: DeleteAdministration = mock()

    @MockitoBean
    private val getAdministrationById: GetAdministrationById = mock()

    @MockitoBean
    private val getAdministrations: GetAdministrations = mock()

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `archive() should archive an administration`() {
        val administrationId = 1

        mockMvc
            .perform(
                put("/api/v1/administrations/$administrationId/archive"),
            ).andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)

        BDDMockito.verify(archiveAdministration).execute(administrationId)
    }

    @Test
    fun `canArchive() should check if an administration can be archived`() {
        val administrationId = 1

        given(canArchiveAdministration.execute(administrationId)).willReturn(true)

        mockMvc
            .perform(get("/api/v1/administrations/$administrationId/can_archive"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.value").value(true))

        BDDMockito.verify(canArchiveAdministration).execute(administrationId)
    }

    @Test
    fun `canDelete() should check if an administration can be deleted`() {
        val administrationId = 1

        given(canDeleteAdministration.execute(administrationId)).willReturn(true)

        mockMvc
            .perform(get("/api/v1/administrations/$administrationId/can_delete"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.value").value(true))

        BDDMockito.verify(canDeleteAdministration).execute(administrationId)
    }

    @Test
    fun `create() should create an administration`() {
        val expectedCreatedAdministration =
            AdministrationEntity(
                id = 1,
                isArchived = false,
                name = "Administration Name",
            )

        val newAdministrationData =
            CreateOrUpdateAdministrationDataInput(
                isArchived = false,
                name = "Administration Name",
            )
        val requestBody = objectMapper.writeValueAsString(newAdministrationData)

        given(createOrUpdateAdministration.execute(administration = any())).willReturn(expectedCreatedAdministration)

        mockMvc
            .perform(
                post("/api/v1/administrations")
                    .content(requestBody)
                    .contentType(MediaType.APPLICATION_JSON),
            ).andDo(MockMvcResultHandlers.print())
            .andExpect(status().isCreated)
    }

    @Test
    fun `delete() should delete an administration`() {
        val administrationId = 1

        mockMvc
            .perform(
                delete("/api/v1/administrations/$administrationId"),
            ).andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)

        BDDMockito.verify(deleteAdministration).execute(administrationId)
    }

    @Test
    fun `get() should get an administration by its ID`() {
        val expectedFullAdministration =
            FullAdministrationDTO(
                administration =
                    AdministrationEntity(
                        id = 1,
                        isArchived = false,
                        name = "Administration Name",
                    ),
                controlUnits = listOf(),
            )

        val requestedId = 1

        given(getAdministrationById.execute(requestedId)).willReturn(expectedFullAdministration)

        mockMvc
            .perform(get("/api/v1/administrations/$requestedId"))
            .andExpect(status().isOk)

        BDDMockito.verify(getAdministrationById).execute(requestedId)
    }

    @Test
    fun `getAll() should get all administrations`() {
        val expectedAFulldministrations =
            listOf(
                FullAdministrationDTO(
                    administration =
                        AdministrationEntity(
                            id = 1,
                            isArchived = false,
                            name = "Administration Name",
                        ),
                    controlUnits = listOf(),
                ),
                FullAdministrationDTO(
                    administration =
                        AdministrationEntity(
                            id = 2,
                            isArchived = false,
                            name = "Administration Name 2",
                        ),
                    controlUnits = listOf(),
                ),
            )

        given(getAdministrations.execute()).willReturn(expectedAFulldministrations)

        mockMvc
            .perform(get("/api/v1/administrations"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize<Any>(2)))

        BDDMockito.verify(getAdministrations).execute()
    }

    @Test
    fun `update() should update an administration`() {
        val expectedUpdatedAdministration =
            AdministrationEntity(
                id = 1,
                isArchived = false,
                name = "Updated Administration Name",
            )

        val nextAdministrationData =
            CreateOrUpdateAdministrationDataInput(
                id = 1,
                isArchived = false,
                name = "Updated Administration Name",
            )
        val requestBody = objectMapper.writeValueAsString(nextAdministrationData)

        given(createOrUpdateAdministration.execute(administration = any())).willReturn(expectedUpdatedAdministration)

        mockMvc
            .perform(
                put("/api/v1/administrations/1")
                    .content(requestBody)
                    .contentType(MediaType.APPLICATION_JSON),
            ).andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }
}
