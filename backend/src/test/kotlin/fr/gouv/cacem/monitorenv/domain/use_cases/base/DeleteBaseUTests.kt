package fr.gouv.cacem.monitorenv.domain.use_cases.base

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ForeignKeyConstraintException
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class DeleteBaseUTests {
    @MockBean
    private lateinit var baseRepository: IBaseRepository

    @MockBean
    private lateinit var canDeleteBase: CanDeleteBase

    @Test
    fun `execute should delete when canDeleteBase returns true`() {
        val baseId = 1

        given(canDeleteBase.execute(baseId)).willReturn(true)

        DeleteBase(baseRepository, canDeleteBase).execute(baseId)

        verify(baseRepository).deleteById(baseId)
    }

    @Test
    fun `execute should throw ForeignKeyConstraintException when canDeleteBase returns false`() {
        val baseId = 1

        given(canDeleteBase.execute(baseId)).willReturn(false)

        assertThatThrownBy {
            DeleteBase(baseRepository, canDeleteBase).execute(baseId)
        }
            .isInstanceOf(ForeignKeyConstraintException::class.java)
    }
}
