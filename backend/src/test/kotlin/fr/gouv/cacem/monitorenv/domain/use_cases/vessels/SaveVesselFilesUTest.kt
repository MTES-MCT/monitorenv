package fr.gouv.cacem.monitorenv.domain.use_cases.vessels

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselIdEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures.VesselFixture.Companion.aVesselFile
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class SaveVesselFilesUTest {
    val vesselRepository: IVesselRepository = mock()
    val saveVesselFiles = SaveVesselFiles(vesselRepository)

    @Test
    fun `execute should return the saved files`() {
        // Given
        val vesselFiles = listOf(aVesselFile())
        val vesselId = VesselIdEntity(batchId = null, rowNumber = null, shipId = 1)

        given(vesselRepository.saveFiles(vesselId = vesselId, vesselFiles = vesselFiles)).willReturn(vesselFiles)

        // When
        val savedVesselFiles = saveVesselFiles.execute(vesselId = vesselId, vesselFiles = vesselFiles)

        // Then
        assertThat(savedVesselFiles).isEqualTo(vesselFiles)
    }
}
