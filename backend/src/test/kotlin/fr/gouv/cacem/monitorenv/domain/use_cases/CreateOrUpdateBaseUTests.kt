package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.base.CreateOrUpdateBase
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CreateOrUpdateBaseUTests {
    @MockBean
    private lateinit var baseRepository: IBaseRepository

    @Test
    fun `execute() should return save() result`() {
        val base = BaseEntity(
            controlUnitResourceIds = listOf(3),
            name = "Base Name"
        )

        val expectation = base.copy(id = 3)

        given(baseRepository.save(base)).willReturn(expectation)

        val result =
            CreateOrUpdateBase(baseRepository).execute(
                base
            )

        verify(baseRepository, times(1)).save(base)
        assertThat(result).isEqualTo(expectation)
    }
}
