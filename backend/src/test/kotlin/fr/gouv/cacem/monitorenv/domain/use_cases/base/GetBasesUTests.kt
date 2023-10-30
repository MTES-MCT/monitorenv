package fr.gouv.cacem.monitorenv.domain.use_cases.base

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class GetBasesUTests {
    @MockBean
    private lateinit var baseRepository: IBaseRepository

    @Test
    fun `execute should return all bases`() {
        val bases = listOf(
            FullBaseDTO(
                base = BaseEntity(
                    id = 1,
                    latitude = 0.0,
                    longitude = 0.0,
                    name = "Base Name",
                ),
                controlUnitResources = listOf(),
            ),
            FullBaseDTO(
                base = BaseEntity(
                    id = 2,
                    latitude = 0.0,
                    longitude = 0.0,
                    name = "Base Name 2",
                ),
                controlUnitResources = listOf(),
            ),
        )

        given(baseRepository.findAll()).willReturn(bases)

        val result = GetBases(baseRepository).execute()

        assertThat(result.size).isEqualTo(1)
        assertThat(result).isEqualTo(bases)
    }
}
