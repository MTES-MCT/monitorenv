package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.boot.test.mock.mockito.MockBean

class CreateOrUpdateVigilanceAreaUTests {
    @MockBean private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()

    private val createOrUpdateVigilanceArea: CreateOrUpdateVigilanceArea =
        CreateOrUpdateVigilanceArea(
            vigilanceAreaRepository,
        )

    @Test
    fun `execute should return save() result`() {
        val newVigilanceArea =
            VigilanceAreaEntity(
                comments = "Comments",
                isArchived = false,
                isDeleted = false,
                isDraft = true,
            )

        val expectedVigilanceArea = newVigilanceArea.copy(id = 0)

        given(vigilanceAreaRepository.save(newVigilanceArea)).willReturn(expectedVigilanceArea)

        val result = createOrUpdateVigilanceArea.execute(newVigilanceArea)

        verify(vigilanceAreaRepository, times(1)).save(newVigilanceArea)
        Assertions.assertThat(result).isEqualTo(expectedVigilanceArea)
    }
}
