package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.junit.jupiter.api.Test

class DeleteVigilanceAreaUTests {

    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()

    @Test
    fun `execute should delete vigilanceArea`() {
        val vigilanceAreaId = 1

        DeleteVigilanceArea(vigilanceAreaRepository).execute(vigilanceAreaId)

        verify(vigilanceAreaRepository).delete(vigilanceAreaId)
    }
}
