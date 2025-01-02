package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class DeleteControlUnitResourceUTests {
    @MockBean
    private lateinit var controlUnitResourceRepository: IControlUnitResourceRepository

    @MockBean
    private lateinit var canDeleteControlUnitResource: CanDeleteControlUnitResource

    @Test
    fun `execute should delete control unit resource when canDeleteControlUnitResource returns true`(
        log: CapturedOutput,
    ) {
        val controlUnitResourceId = 1

        given(canDeleteControlUnitResource.execute(controlUnitResourceId)).willReturn(true)

        DeleteControlUnitResource(canDeleteControlUnitResource, controlUnitResourceRepository).execute(
            controlUnitResourceId,
        )

        verify(controlUnitResourceRepository).deleteById(controlUnitResourceId)
        assertThat(log.out).contains("Attempt to DELETE control unit resource $controlUnitResourceId")
        assertThat(log.out).contains("Control unit resource $controlUnitResourceId deleted")
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
