package fr.gouv.cacem.monitorenv.domain.mappers

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.PatchableControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitResourceFixture.Companion.aControlUnitResource
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.util.Optional

class PatchControlUnitResourceEntityUTest {
    private val patchEntity: PatchEntity<ControlUnitResourceEntity, PatchableControlUnitResourceEntity> = PatchEntity()

    @Test
    fun `execute() should return controlUnitResource with radioFrequency modified if its present`() {
        // Given
        val radioFrequency = "radioFrequency"
        val controlUnitResource = aControlUnitResource()
        val patchableControlUnitResource =
            PatchableControlUnitResourceEntity(
                radioFrequency = Optional.of(radioFrequency),
                registrationId = null,
            )

        // When
        patchEntity.execute(controlUnitResource, patchableControlUnitResource)

        // Then
        assertThat(controlUnitResource.radioFrequency).isEqualTo(radioFrequency)
    }

    @Test
    fun `execute() should return controlUnitResource with radioFrequency null if its empty`() {
        // Given
        val controlUnitResource = aControlUnitResource()
        val patchableControlUnitResource =
            PatchableControlUnitResourceEntity(
                radioFrequency = Optional.empty(),
                registrationId = null,
            )

        // When
        patchEntity.execute(controlUnitResource, patchableControlUnitResource)

        // Then
        assertThat(controlUnitResource.radioFrequency).isNull()
    }

    @Test
    fun `execute() should return controlUnitResource with old radioFrequency if its null`() {
        // Given
        val controlUnitResource = aControlUnitResource(radioFrequency = "old radio frequency")
        val patchableControlUnitResource =
            PatchableControlUnitResourceEntity(
                radioFrequency = null,
                registrationId = null,
            )

        // When
        patchEntity.execute(controlUnitResource, patchableControlUnitResource)

        // Then
        assertThat(controlUnitResource.radioFrequency).isEqualTo("old radio frequency")
    }

    @Test
    fun `execute() should return controlUnitResource with registrationId modified if its present`() {
        // Given
        val registrationId = "registrationId"
        val controlUnitResource = aControlUnitResource()
        val patchableControlUnitResource =
            PatchableControlUnitResourceEntity(
                radioFrequency = null,
                registrationId = Optional.of(registrationId),
            )

        // When
        patchEntity.execute(controlUnitResource, patchableControlUnitResource)

        // Then
        assertThat(controlUnitResource.registrationId).isEqualTo(registrationId)
    }

    @Test
    fun `execute() should return controlUnitResource with registrationId null if its empty`() {
        // Given
        val controlUnitResource = aControlUnitResource()
        val patchableControlUnitResource =
            PatchableControlUnitResourceEntity(
                radioFrequency = null,
                registrationId = Optional.empty(),
            )

        // When
        patchEntity.execute(controlUnitResource, patchableControlUnitResource)

        // Then
        assertThat(controlUnitResource.registrationId).isNull()
    }

    @Test
    fun `execute() should return controlUnitResource with old registrationId if its null`() {
        // Given
        val controlUnitResource = aControlUnitResource(registrationId = "old registrationId")
        val patchableControlUnitResource =
            PatchableControlUnitResourceEntity(
                radioFrequency = null,
                registrationId = null,
            )

        // When
        patchEntity.execute(controlUnitResource, patchableControlUnitResource)

        // Then
        assertThat(controlUnitResource.registrationId).isEqualTo("old registrationId")
    }
}
