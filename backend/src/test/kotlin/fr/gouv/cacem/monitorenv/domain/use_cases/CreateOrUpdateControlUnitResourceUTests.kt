package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitResource
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CreateOrUpdateControlUnitResourceUTests {
    @MockBean
    private lateinit var controlUnitResourceRepository: IControlUnitResourceRepository

    @Test
    fun `execute() should return save() result`() {
        val controlUnitResource = ControlUnitResourceEntity(
            baseId = 2,
            controlUnitId = 3,
            name = "Control Unit Resource Name",
            note = null,
            photo = null,
            type = ControlUnitResourceType.BARGE,
        )

        val expectation = controlUnitResource.copy(id = 1)

        given(controlUnitResourceRepository.save(controlUnitResource)).willReturn(expectation)

        val result =
            CreateOrUpdateControlUnitResource(controlUnitResourceRepository).execute(
                controlUnitResource
            )

        verify(controlUnitResourceRepository, times(1)).save(controlUnitResource)
        assertThat(result).isEqualTo(expectation)
    }
}
