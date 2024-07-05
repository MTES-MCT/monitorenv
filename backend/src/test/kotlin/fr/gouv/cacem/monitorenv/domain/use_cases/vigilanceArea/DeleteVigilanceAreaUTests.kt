package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class DeleteVigilanceAreaUTests {
    @MockBean
    private lateinit var vigilanceAreaRepository: IVigilanceAreaRepository

    @Test
    fun `execute should delete vigilanceArea`() {
        val vigilanceAreaId = 1

        DeleteVigilanceArea(vigilanceAreaRepository).execute(vigilanceAreaId)

        verify(vigilanceAreaRepository).delete(vigilanceAreaId)
    }
}
