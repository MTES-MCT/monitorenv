package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class DeleteControlUnitUTests {
    @MockBean
    private lateinit var controlUnitRepository: IControlUnitRepository

    @MockBean
    private lateinit var canDeleteControlUnit: CanDeleteControlUnit

    @Test
    fun `execute should delete control unit when canDeleteControlUnit returns true`() {
        val controlUnitId = 1

        given(canDeleteControlUnit.execute(controlUnitId)).willReturn(true)

        DeleteControlUnit(controlUnitRepository, canDeleteControlUnit).execute(controlUnitId)

        verify(controlUnitRepository).deleteById(controlUnitId)
    }

    @Test
    fun `execute should throw CouldNotDeleteException when canDeleteControlUnit returns false`() {
        val controlUnitId = 1

        given(canDeleteControlUnit.execute(controlUnitId)).willReturn(false)

        assertThatThrownBy {
            DeleteControlUnit(controlUnitRepository, canDeleteControlUnit).execute(controlUnitId)
        }
            .isInstanceOf(CouldNotDeleteException::class.java)
    }
}
