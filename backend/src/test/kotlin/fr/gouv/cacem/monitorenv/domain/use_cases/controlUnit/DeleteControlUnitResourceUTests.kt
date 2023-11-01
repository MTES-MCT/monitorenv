package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ForeignKeyConstraintException
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class DeleteControlUnitResourceUTests {
    @MockBean
    private lateinit var controlUnitResourceRepository: IControlUnitResourceRepository

    @MockBean
    private lateinit var canDeleteControlUnitResource: CanDeleteControlUnitResource

    @Test
    fun `execute should delete control unit resource when canDeleteControlUnitResource returns true`() {
        val controlUnitResourceId = 1

        given(canDeleteControlUnitResource.execute(controlUnitResourceId)).willReturn(true)

        DeleteControlUnitResource(canDeleteControlUnitResource, controlUnitResourceRepository).execute(
            controlUnitResourceId
        )

        verify(controlUnitResourceRepository).deleteById(controlUnitResourceId)
    }

    @Test
    fun `execute should throw ForeignKeyConstraintException when canDeleteControlUnitResource returns false`() {
        val controlUnitResourceId = 1

        given(canDeleteControlUnitResource.execute(controlUnitResourceId)).willReturn(false)

        assertThatThrownBy {
            DeleteControlUnitResource(canDeleteControlUnitResource, controlUnitResourceRepository).execute(
                controlUnitResourceId
            )
        }
            .isInstanceOf(ForeignKeyConstraintException::class.java)
    }
}
