package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.PatchableControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.mappers.PatchEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitResourceFixture.Companion.aControlUnitResource
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitResourceFixture.Companion.aFullControlUnitResourcesDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.util.Optional
import kotlin.random.Random

@ExtendWith(OutputCaptureExtension::class)
class PatchControlUnitResourceUTest {
    private val controlUnitRepository: IControlUnitResourceRepository = mock()
    val patchEntity: PatchEntity<ControlUnitResourceEntity, PatchableControlUnitResourceEntity> = PatchEntity()
    private val patchControlUnitResource = PatchControlUnitResource(controlUnitRepository, patchEntity)

    @Test
    fun `execute() should return the patched entity`(log: CapturedOutput) {
        // Given
        val id = Random.nextInt()
        val radioFrequency = "RadioFrequency"
        val registrationId = "registrationId"
        val patchableControlUnitResource =
            PatchableControlUnitResourceEntity(
                radioFrequency = Optional.of(radioFrequency),
                registrationId = Optional.of(registrationId),
            )
        val controlUnitFromDatabase = aFullControlUnitResourcesDTO()
        val controlUnitResourcePatched =
            aControlUnitResource().copy(radioFrequency = radioFrequency, registrationId = registrationId)

        given(controlUnitRepository.findById(id)).willReturn(controlUnitFromDatabase)
        given(controlUnitRepository.save(controlUnitResourcePatched)).willReturn(controlUnitResourcePatched)

        // When
        val savedControlUnitResource = patchControlUnitResource.execute(id, patchableControlUnitResource)

        // Then
        assertThat(savedControlUnitResource.radioFrequency).isEqualTo(controlUnitResourcePatched.radioFrequency)
        assertThat(savedControlUnitResource.registrationId).isEqualTo(controlUnitResourcePatched.registrationId)
        assertThat(log.out).contains("Attempt to PATCH control unit resource $id")
        assertThat(log.out).contains("Control unit resource $id patched")
    }

    @Test
    fun `execute() should throw BackendUsageException with message when the entity does not exist`() {
        // Given
        val id = Random.nextInt()
        val patchableControlUnitResource =
            PatchableControlUnitResourceEntity(
                radioFrequency = null,
                registrationId = null,
            )

        given(controlUnitRepository.findById(id)).willReturn(null)

        // When & Then
        val exception =
            assertThrows<BackendUsageException> { patchControlUnitResource.execute(id, patchableControlUnitResource) }

        assertThat(exception.message).isEqualTo("Control unit resource $id not found")
    }
}
