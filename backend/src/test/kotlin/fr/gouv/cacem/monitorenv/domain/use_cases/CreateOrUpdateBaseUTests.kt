package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
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
        val newBase = BaseEntity(
            name = "Base Name"
        )

        val expectedBase = newBase.copy(id = 0)

        given(baseRepository.save(newBase)).willReturn(expectedBase)

        val result = CreateOrUpdateBase(baseRepository).execute(newBase)

        verify(baseRepository, times(1)).save(newBase)
        assertThat(result).isEqualTo(expectedBase)
    }
}
