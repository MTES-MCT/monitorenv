package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.eq
import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.DeleteUser
import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.ImportUsers
import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.SaveUser
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.AbstractEndpointTests
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.security.ApiPublicFilterConfig
import fr.gouv.cacem.monitorenv.infrastructure.file.csv.CsvImportUser
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.Mockito.mock
import org.mockito.Mockito.never
import org.mockito.Mockito.verify
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.context.TestPropertySource
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.json.JsonMapper

@Import(ApiPublicFilterConfig::class)
@TestPropertySource(properties = ["monitorenv.api.protected.api-key=test-key"])
@WebMvcTest(value = [(UserManagementController::class)])
class UserManagementControllerITests : AbstractEndpointTests() {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var jsonMapper: JsonMapper

    @MockitoBean
    private lateinit var saveUser: SaveUser

    @MockitoBean
    private lateinit var deleteUser: DeleteUser

    @MockitoBean
    private lateinit var importUsers: ImportUsers

    @MockitoBean
    private lateinit var csvImportUser: CsvImportUser

    private val baseUrl = "/api/v1/authorization/management"

    @Test
    fun `Should reject a request without api key`() {
        mockMvc.perform(delete("$baseUrl/john.doe@gouv.fr"))
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun `Should reject a request with the wrong key api key`() {
        mockMvc.perform(
            delete("$baseUrl/john.doe@gouv.fr").header("x-api-key", "wrong-key")
        )
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun `Should create a user`() {
        // Given
        val input = mapOf("email" to "john.doe@gouv.fr", "isSuperUser" to false)

        // When
        mockMvc
            .perform(
                post(baseUrl)
                    .header("x-api-key", "test-key")
                    .content(jsonMapper.writeValueAsString(input))
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isCreated)

        verify(saveUser).execute(any())
    }

    @Test
    fun `Should delete a user`() {
        // When
        mockMvc
            .perform(
                delete("$baseUrl/john.doe@gouv.fr").header("x-api-key", "test-key")
            )
            // Then
            .andExpect(status().isOk)

        verify(deleteUser).execute("john.doe@gouv.fr")
    }

    @Test
    fun `Should import super users from a csv file`() {
        // Given
        val file = MockMultipartFile("file", "users.csv", "text/csv", "email\njohn@gouv.fr".toByteArray())
        val parsed = listOf(mock<UserAuthorization>(), mock<UserAuthorization>())
        given(csvImportUser.parse(any(), eq(true))).willReturn(parsed)
        given(importUsers.execute(parsed)).willReturn(parsed)

        // When
        mockMvc
            .perform(
                multipart("$baseUrl/import/super-users").file(file).header("x-api-key", "test-key")
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(content().string("Imported 2 super-users"))
    }

    @Test
    fun `Should return 400 when importing super users with an empty file`() {
        // Given
        val file = MockMultipartFile("file", "users.csv", "text/csv", ByteArray(0))

        // When
        mockMvc
            .perform(
                multipart("$baseUrl/import/super-users").file(file).header("x-api-key", "test-key")
            )
            // Then
            .andExpect(status().isBadRequest)
            .andExpect(content().string("Le fichier est vide"))

        verify(importUsers, never()).execute(any())
    }

    @Test
    fun `Should return 400 when importing super users with a non csv file`() {
        // Given
        val file = MockMultipartFile("file", "users.txt", "text/plain", "data".toByteArray())

        // When
        mockMvc
            .perform(
                multipart("$baseUrl/import/super-users").file(file).header("x-api-key", "test-key")
            )
            // Then
            .andExpect(status().isBadRequest)
            .andExpect(content().string("Le format attendu est .csv"))

        verify(importUsers, never()).execute(any())
    }

    @Test
    fun `Should return 400 when importing super users without a file part`() {
        // When
        mockMvc
            .perform(
                multipart("$baseUrl/import/super-users").header("x-api-key", "test-key")
            )
            // Then
            .andExpect(status().isBadRequest)
    }

    @Test
    fun `Should import users from a csv file`() {
        // Given
        val file = MockMultipartFile("file", "users.csv", "text/csv", "email\njohn@gouv.fr".toByteArray())
        val parsed = listOf(mock<UserAuthorization>())
        given(csvImportUser.parse(any(), eq(false))).willReturn(parsed)
        given(importUsers.execute(parsed)).willReturn(parsed)

        // When
        mockMvc
            .perform(
                multipart("$baseUrl/import/users").file(file).header("x-api-key", "test-key")
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(content().string("Imported 1 users"))
    }

    @Test
    fun `Should return 400 when importing users with an empty file`() {
        // Given
        val file = MockMultipartFile("file", "users.csv", "text/csv", ByteArray(0))

        // When
        mockMvc
            .perform(
                multipart("$baseUrl/import/users").file(file).header("x-api-key", "test-key")
            )
            // Then
            .andExpect(status().isBadRequest)
            .andExpect(content().string("Le fichier est vide"))
    }

    @Test
    fun `Should return 400 when importing users with a non csv file`() {
        // Given
        val file = MockMultipartFile("file", "users.json", "application/json", "{}".toByteArray())

        // When
        mockMvc
            .perform(
                multipart("$baseUrl/import/users").file(file).header("x-api-key", "test-key")
            )
            // Then
            .andExpect(status().isBadRequest)
            .andExpect(content().string("Le format attendu est .csv"))
    }
}