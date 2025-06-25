package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.utils

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.infrastructure.api.utils.validateId
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class FakeController(
    private val objectMapper: ObjectMapper,
) {
    @PatchMapping(value = ["/api/v1/fakes/{fakeId}"], consumes = ["application/json"])
    fun patch(
        @PathVariable(name = "fakeId")
        fakeId: Int,
        @RequestBody partialFakeAsJson: String,
    ) {
        validateId(partialFakeAsJson, "id", fakeId, objectMapper)
    }
}

@ExtendWith(SpringExtension::class)
class ValidateIdUTests {
    private lateinit var fakeController: FakeController
    private val objectMapper = ObjectMapper()

    @BeforeEach
    fun setUp() {
        fakeController = FakeController(objectMapper)
    }

    @Test
    fun `validateId should throw an exception when id is missing in JSON`() {
        // Given
        val fakeRequestDataAsJson = "{}"

        // Then
        val exception =
            assertThrows<BackendUsageException> {
                // When
                fakeController.patch(1, fakeRequestDataAsJson)
            }
        assertThat(exception.code).isEqualTo(BackendUsageErrorCode.UNVALID_PROPERTY)
        assertThat(exception).hasMessageContaining("`id` is missing in the request data.")
    }

    @Test
    fun `validateId should throw an exception when id is null in JSON`() {
        // Given
        val fakeRequestDataAsJson = "{ \"id\": null }"

        // Then
        val exception =
            assertThrows<BackendUsageException> {
                // When
                fakeController.patch(1, fakeRequestDataAsJson)
            }
        assertThat(exception.code).isEqualTo(BackendUsageErrorCode.UNVALID_PROPERTY)
        assertThat(exception).hasMessageContaining("`id` is `null` in the request data.")
    }

    @Test
    fun `validateId should throw an exception when id is not an integer`() {
        // Given
        val fakeRequestDataAsJson = "{ \"id\": \"not an integer\" }"

        // Then
        val exception =
            assertThrows<BackendUsageException> {
                // When
                fakeController.patch(1, fakeRequestDataAsJson)
            }
        assertThat(exception.code).isEqualTo(BackendUsageErrorCode.UNVALID_PROPERTY)
        assertThat(exception).hasMessageContaining("`id` must be an integer in the request data.")
    }

    @Test
    fun `validateId should throw an exception when id in JSON does not match id from request path`() {
        // Given
        val fakeRequestDataAsJson = "{ \"id\": 2 }"

        // Then
        val exception =
            assertThrows<BackendUsageException> {
                // When
                fakeController.patch(1, fakeRequestDataAsJson)
            }
        assertThat(exception.code).isEqualTo(BackendUsageErrorCode.UNVALID_PROPERTY)
        assertThat(exception).hasMessageContaining(
            "Request data `id` ('2') doesn't match the {id} in the request path ('1').",
        )
    }

    @Test
    fun `validateId should not throw any exception when id in JSON matches id from request path`() {
        // Given
        val fakeRequestDataAsJson = "{ \"id\": 1 }"

        // Then
        assertDoesNotThrow {
            // When
            fakeController.patch(1, fakeRequestDataAsJson)
        }
    }
}
