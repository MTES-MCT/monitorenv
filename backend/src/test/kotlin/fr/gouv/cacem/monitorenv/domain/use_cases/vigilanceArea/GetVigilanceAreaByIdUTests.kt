package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.junit.jupiter.api.Test
import org.assertj.core.api.Assertions.assertThat
import org.springframework.boot.test.mock.mockito.MockBean

class GetVigilanceAreaByIdUTests {

    @MockBean
    private lateinit var vigilanceAreaRepository: IVigilanceAreaRepository

    @Test
    fun `execute should return vigilance area entity`() {

        val vigilanceAreaId = 10
        val expectedEntity = VigilanceAreaEntity(
            id = vigilanceAreaId,
            comments= "Test Area",
            isDeleted= false,
            isDraft = true
        )

        given(vigilanceAreaRepository.findById(vigilanceAreaId)).willReturn(expectedEntity)
        val result = GetVigilanceAreaById(vigilanceAreaRepository).execute(vigilanceAreaId)


        verify(vigilanceAreaRepository, times(1)).findById(vigilanceAreaId)
        assertThat(expectedEntity).isEqualTo(result)
    }
}
