package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CreateOrUpdateVigilanceAreaUTests {
    @MockBean
    private lateinit var vigilanceAreaRepository: IVigilanceAreaRepository

    @Test
    fun `execute should return save() result`() {
        val newVigilanceArea = VigilanceAreaEntity(
            comments = "Comments",
            isDeleted = false,
            isDraft = true,
        )

        val expectedVigilanceArea = newVigilanceArea.copy(id = 0)

        given(vigilanceAreaRepository.save(newVigilanceArea)).willReturn(expectedVigilanceArea)

        val result = CreateOrUpdateVigilanceArea(vigilanceAreaRepository).execute(newVigilanceArea)

        verify(vigilanceAreaRepository, times(1)).save(newVigilanceArea)
        Assertions.assertThat(result).isEqualTo(expectedVigilanceArea)
    }
}
