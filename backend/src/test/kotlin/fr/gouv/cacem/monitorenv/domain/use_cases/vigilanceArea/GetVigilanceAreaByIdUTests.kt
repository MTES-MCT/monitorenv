package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class GetVigilanceAreaByIdUTests {

    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()

    @Test
    fun `execute should return vigilance area entity`() {
        val vigilanceAreaId = 10
        val expectedEntity =
            VigilanceAreaEntity(
                id = vigilanceAreaId,
                comments = "Test Area",
                isArchived = false,
                isDeleted = false,
                isDraft = true,
            )

        given(vigilanceAreaRepository.findById(vigilanceAreaId)).willReturn(expectedEntity)

        val result = GetVigilanceAreaById(vigilanceAreaRepository).execute(vigilanceAreaId)

        assertThat(expectedEntity).isEqualTo(result)
    }
}
