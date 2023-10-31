package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class ArchiveControlUnitUTests {
    @MockBean
    private lateinit var controlUnitRepository: IControlUnitRepository

    @Test
    fun `execute should archive a control unit by its ID`() {
        val controlUnitId = 1

        ArchiveControlUnit(controlUnitRepository).execute(controlUnitId)

        verify(controlUnitRepository).archiveById(controlUnitId)
    }
}
