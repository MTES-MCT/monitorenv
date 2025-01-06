package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class DeleteControlUnitResourceUTests {
    @Mock
    private val controlUnitResourceRepository: IControlUnitResourceRepository = mock()

    @Mock
    private val canDeleteControlUnitResource: CanDeleteControlUnitResource = mock()

    @Test
    fun `execute should delete control unit resource when canDeleteControlUnitResource returns true`() {
        val controlUnitResourceId = 1

        given(canDeleteControlUnitResource.execute(controlUnitResourceId)).willReturn(true)

        DeleteControlUnitResource(canDeleteControlUnitResource, controlUnitResourceRepository).execute(
            controlUnitResourceId,
        )

        verify(controlUnitResourceRepository).deleteById(controlUnitResourceId)
    }

    @Test
    fun `execute should throw CouldNotDeleteException when canDeleteControlUnitResource returns false`() {
        val controlUnitResourceId = 1

        given(canDeleteControlUnitResource.execute(controlUnitResourceId)).willReturn(false)

        assertThatThrownBy {
            DeleteControlUnitResource(canDeleteControlUnitResource, controlUnitResourceRepository).execute(
                controlUnitResourceId,
            )
        }
            .isInstanceOf(CouldNotDeleteException::class.java)
    }
}
