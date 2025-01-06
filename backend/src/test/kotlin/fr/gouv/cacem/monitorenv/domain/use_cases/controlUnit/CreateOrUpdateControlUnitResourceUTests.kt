package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CreateOrUpdateControlUnitResourceUTests {
    @Mock
    private val controlUnitResourceRepository: IControlUnitResourceRepository = mock()

    @Test
    fun `execute should return save() result`() {
        val newControlUnitResource =
            ControlUnitResourceEntity(
                controlUnitId = 3,
                isArchived = false,
                name = "Control Unit Resource Name",
                note = null,
                photo = null,
                stationId = 2,
                type = ControlUnitResourceType.BARGE,
            )

        val expectedControlUnitResource = newControlUnitResource.copy(id = 0)

        given(controlUnitResourceRepository.save(newControlUnitResource)).willReturn(expectedControlUnitResource)

        val result = CreateOrUpdateControlUnitResource(controlUnitResourceRepository).execute(newControlUnitResource)

        verify(controlUnitResourceRepository, times(1)).save(newControlUnitResource)
        assertThat(result).isEqualTo(expectedControlUnitResource)
    }
}
