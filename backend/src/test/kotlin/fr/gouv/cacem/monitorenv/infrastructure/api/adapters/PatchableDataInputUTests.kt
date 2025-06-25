package fr.gouv.cacem.monitorenv.infrastructure.api.adapters

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.test.context.junit.jupiter.SpringExtension

data class FakeEntity(
    val id: Int,
    val name: String,
    val description: String?,
    val isAwesome: Boolean,
    val isDeleted: Boolean,
    val isUpdated: Boolean,
    val rank: Int,
)

data class FakeDataInput(
    val id: Int,
    val name: String,
    val description: String?,
    val isAwesome: Boolean,
    val isDeleted: Boolean,
    val isUpdated: Boolean,
    val rank: Int,
) : PatchableDataInput<FakeDataInput>(FakeDataInput::class) {
    companion object {
        fun fromFakeEntity(entity: FakeEntity): FakeDataInput =
            FakeDataInput(
                id = entity.id,
                name = entity.name,
                description = entity.description,
                isAwesome = entity.isAwesome,
                isDeleted = entity.isDeleted,
                isUpdated = entity.isUpdated,
                rank = entity.rank,
            )
    }
}

@ExtendWith(SpringExtension::class)
class PatchableDataInputUTests {
    private lateinit var existingFakeEntityFromDatabase: FakeEntity
    private val objectMapper = ObjectMapper()

    @BeforeEach
    fun setUp() {
        existingFakeEntityFromDatabase =
            FakeEntity(
                id = 1,
                name = "A name",
                description = "A description",
                isAwesome = true,
                isDeleted = false,
                isUpdated = false,
                rank = 2,
            )
    }

    @Test
    fun `patchFromRequestData Should return the expected data input instance`() {
        // Given
        val fakeRequestDataAsJson =
            """
            {
                "name": "A new name",
                "description": null,
                "isUpdated": true
            }
            """.trimIndent()

        // When
        val result =
            FakeDataInput
                .fromFakeEntity(existingFakeEntityFromDatabase)
                .patchFromRequestData(objectMapper, fakeRequestDataAsJson)

        // Then
        assertThat(result).isEqualTo(
            FakeDataInput(
                id = 1,
                name = "A new name",
                description = null,
                isAwesome = true,
                isDeleted = false,
                isUpdated = true,
                rank = 2,
            ),
        )
    }

    @Test
    fun `patchFromRequestData Should ignore extra properties from the request data JSON`() {
        // Given
        val fakeRequestDataAsJson =
            """
            {
                "name": "A new name",
                "anNonExistingProperty": "A lost value"
            }
            """.trimIndent()

        // When
        val result =
            FakeDataInput
                .fromFakeEntity(existingFakeEntityFromDatabase)
                .patchFromRequestData(objectMapper, fakeRequestDataAsJson)

        // Then
        assertThat(result).isEqualTo(
            FakeDataInput(
                id = 1,
                name = "A new name",
                description = "A description",
                isAwesome = true,
                isDeleted = false,
                isUpdated = false,
                rank = 2,
            ),
        )
    }

    @Test
    fun `patchFromRequestData Should throw a BackendRequestException for an incorrect Boolean type`() {
        // Given
        val fakeRequestDataAsJson =
            """
            {
                "isAwesome": "Not a Boolean"
            }
            """.trimIndent()

        // Then
        val exception =
            assertThrows<BackendUsageException> {
                // When
                FakeDataInput
                    .fromFakeEntity(existingFakeEntityFromDatabase)
                    .patchFromRequestData(objectMapper, fakeRequestDataAsJson)
            }
        assertThat(exception.code).isEqualTo(BackendUsageErrorCode.UNVALID_PROPERTY)
        assertThat(exception).hasMessageContaining("FakeDataInput: Property `isAwesome` is not of type `Boolean`.")
    }

    @Test
    fun `patchFromRequestData Should throw a BackendRequestException for an incorrect Int type`() {
        // Given
        val fakeRequestDataAsJson =
            """
            {
                "rank": "Not an Int"
            }
            """.trimIndent()

        // Then
        val exception =
            assertThrows<BackendUsageException> {
                // When
                FakeDataInput
                    .fromFakeEntity(existingFakeEntityFromDatabase)
                    .patchFromRequestData(objectMapper, fakeRequestDataAsJson)
            }
        assertThat(exception.code).isEqualTo(BackendUsageErrorCode.UNVALID_PROPERTY)
        assertThat(exception).hasMessageContaining("FakeDataInput: Property `rank` is not of type `Int`.")
    }

    @Test
    fun `patchFromRequestData Should throw a BackendRequestException for an incorrect String type`() {
        // Given
        val fakeRequestDataAsJson =
            """
            {
                "name": 42
            }
            """.trimIndent()

        // Then
        val exception =
            assertThrows<BackendUsageException> {
                // When
                FakeDataInput
                    .fromFakeEntity(existingFakeEntityFromDatabase)
                    .patchFromRequestData(objectMapper, fakeRequestDataAsJson)
            }
        assertThat(exception.code).isEqualTo(BackendUsageErrorCode.UNVALID_PROPERTY)
        assertThat(exception).hasMessageContaining("FakeDataInput: Property `name` is not of type `String`.")
    }

    @Test
    fun `patchFromRequestData Should throw a BackendInternalException for an unsupported type`() {
        data class FakeDataInput(
            val anUnsupportedTypedProp: Any,
        ) : PatchableDataInput<FakeDataInput>(FakeDataInput::class)

        // Given
        val fakeRequestDataAsJson =
            """
            {
                "anUnsupportedTypedProp": "Another value"
            }
            """.trimIndent()

        // Then
        val exception =
            assertThrows<BackendUsageException> {
                // When
                FakeDataInput(anUnsupportedTypedProp = "A value")
                    .patchFromRequestData(objectMapper, fakeRequestDataAsJson)
            }
        assertThat(exception).hasMessageContaining(
            "FakeDataInput: Unsupported type `class kotlin.Any` for property `anUnsupportedTypedProp`.",
        )
    }
}
