package fr.gouv.cacem.monitorenv.domain.use_cases.vessels

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselIdEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures.VesselFixture.Companion.aVesselAdditionalInformation
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class SaveVesselAdditionalInformationUTest {
    val vesselRepository: IVesselRepository = mock()
    val saveVesselAdditionalInformation = SaveVesselAdditionalInformation(vesselRepository)

    @Test
    fun `execute should return the saved additional information`() {
        // Given
        val vesselAdditionalInformation = aVesselAdditionalInformation()
        val vesselId = VesselIdEntity(batchId = null, rowNumber = null, shipId = 1)

        given(
            vesselRepository.saveAdditionalInformation(
                vesselId = vesselId,
                vesselAdditionalInformation = vesselAdditionalInformation,
            ),
        ).willReturn(vesselAdditionalInformation)

        // When
        val saveVesselAdditionalInformation =
            saveVesselAdditionalInformation.execute(
                vesselId = vesselId,
                vesselAdditionalInformation = vesselAdditionalInformation,
            )

        // Then
        assertThat(saveVesselAdditionalInformation).isEqualTo(vesselAdditionalInformation)
    }
}
