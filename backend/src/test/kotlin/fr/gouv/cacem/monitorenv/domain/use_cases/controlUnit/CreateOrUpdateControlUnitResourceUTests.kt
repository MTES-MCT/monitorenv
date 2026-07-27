package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitResourceFixture.Companion.aFullControlUnitResourcesDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class CreateOrUpdateControlUnitResourceUTests {
    @Mock
    private val controlUnitResourceRepository: IControlUnitResourceRepository = mock()

    @Test
    fun `execute should return save() result`(log: CapturedOutput) {
        val newControlUnitResource =
            ControlUnitResourceEntity(
                controlUnitId = 3,
                isArchived = false,
                name = "Control Unit Resource Name",
                note = null,
                photo = null,
                stationId = 2,
                type = ControlUnitResourceType.BARGE,
                radioFrequency = null,
                registrationId = null,
            )

        val expectedControlUnitResource = newControlUnitResource.copy(id = 0)

        given(controlUnitResourceRepository.save(newControlUnitResource)).willReturn(expectedControlUnitResource)

        val result = CreateOrUpdateControlUnitResource(controlUnitResourceRepository).execute(newControlUnitResource)

        verify(controlUnitResourceRepository, times(1)).save(newControlUnitResource)
        assertThat(result).isEqualTo(expectedControlUnitResource)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE control unit resource ${newControlUnitResource.id}")
        assertThat(log.out).contains("Control unit resource ${result.id} created or updated")
    }

    @Test
    fun `execute should merge external information before saving it`(log: CapturedOutput) {
        val newControlUnitResource =
            ControlUnitResourceEntity(
                id = 10,
                controlUnitId = 3,
                isArchived = false,
                name = "Control Unit Resource Name",
                note = null,
                photo = null,
                stationId = 2,
                type = ControlUnitResourceType.BARGE,
                radioFrequency = null,
                registrationId = null,
            )

        val expectedControlUnitResource = newControlUnitResource.copy(id = 0)

        val existingControlUnitResource = aFullControlUnitResourcesDTO()
        given(controlUnitResourceRepository.findById(newControlUnitResource.id!!)).willReturn(
            existingControlUnitResource,
        )
        given(
            controlUnitResourceRepository.save(
                newControlUnitResource.apply {
                    radioFrequency = expectedControlUnitResource.radioFrequency
                    registrationId = existingControlUnitResource.controlUnitResource.registrationId
                },
            ),
        ).willReturn(expectedControlUnitResource)

        val result = CreateOrUpdateControlUnitResource(controlUnitResourceRepository).execute(newControlUnitResource)

        verify(controlUnitResourceRepository, times(1)).findById(newControlUnitResource.id)
        verify(controlUnitResourceRepository, times(1)).save(newControlUnitResource)
        assertThat(result).isEqualTo(expectedControlUnitResource)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE control unit resource ${newControlUnitResource.id}")
        assertThat(log.out).contains("Control unit resource ${result.id} created or updated")
    }

    @Test
    fun `execute should not merge external information when it is creation before saving it`(log: CapturedOutput) {
        val newControlUnitResource =
            ControlUnitResourceEntity(
                id = null,
                controlUnitId = 3,
                isArchived = false,
                name = "Control Unit Resource Name",
                note = null,
                photo = null,
                stationId = 2,
                type = ControlUnitResourceType.BARGE,
                radioFrequency = null,
                registrationId = null,
            )

        val expectedControlUnitResource = newControlUnitResource.copy(id = 0)

        val existingControlUnitResource = aFullControlUnitResourcesDTO()

        given(
            controlUnitResourceRepository.save(
                newControlUnitResource.apply {
                    radioFrequency = expectedControlUnitResource.radioFrequency
                    registrationId = existingControlUnitResource.controlUnitResource.registrationId
                },
            ),
        ).willReturn(expectedControlUnitResource)

        val result = CreateOrUpdateControlUnitResource(controlUnitResourceRepository).execute(newControlUnitResource)

        verify(controlUnitResourceRepository, times(0)).findById(any())
        verify(controlUnitResourceRepository, times(1)).save(newControlUnitResource)
        assertThat(result).isEqualTo(expectedControlUnitResource)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE control unit resource ${newControlUnitResource.id}")
        assertThat(log.out).contains("Control unit resource ${result.id} created or updated")
    }
}
