package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class ArchiveControlUnitResourceUTests {
    @Mock
    private val controlUnitResourceRepository: IControlUnitResourceRepository = mock()

    @Test
    fun `execute should archive a control unit resource by its ID`() {
        val controlUnitResourceId = 1

        ArchiveControlUnitResource(controlUnitResourceRepository).execute(controlUnitResourceId)

        verify(controlUnitResourceRepository).archiveById(controlUnitResourceId)
    }
}
