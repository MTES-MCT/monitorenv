package fr.gouv.cacem.monitorenv.domain.use_cases.vessels

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.ILastPositionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures.LastPositionFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures.VesselFixture.Companion.aVessel
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.verifyNoInteractions
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetVesselByIdUTest {
    private val vesselRepository: IVesselRepository = mock()
    private val lastPositionRepository: ILastPositionRepository = mock()

    val getVesselById = GetVesselById(vesselRepository, lastPositionRepository)

    @Test
    fun `execute should retrieve a vessel by id and last positions by shipId`(log: CapturedOutput) {
        // Given
        val vesselId = 1

        val expectedVessel = aVessel()
        given(vesselRepository.findVesselById(vesselId)).willReturn(expectedVessel)
        val lastPositions = mutableListOf(LastPositionFixture.aLastPosition())
        given(lastPositionRepository.findAll(expectedVessel.shipId!!)).willReturn(lastPositions)

        // When
        val vessel = getVesselById.execute(vesselId)

        // Then
        assertThat(vessel).isEqualTo(expectedVessel.copy(lastPositions = lastPositions))
        assertThat(log.out).contains("GET vessel $vesselId")
    }

    @Test
    fun `execute should retrieve a vessel by id and not last positions by shipId when it is null`(log: CapturedOutput) {
        // Given
        val vesselId = 1

        val expectedVessel = aVessel(shipId = null)
        given(vesselRepository.findVesselById(vesselId)).willReturn(expectedVessel)

        // When
        val vessel = getVesselById.execute(vesselId)

        // Then
        verifyNoInteractions(lastPositionRepository)
        assertThat(vessel).isEqualTo(expectedVessel)
        assertThat(log.out).contains("GET vessel $vesselId")
    }

    @Test
    fun `execute should throw a BackendUsageException when vessel is not found`() {
        // Given
        val vesselId = 1

        given(vesselRepository.findVesselById(vesselId)).willReturn(null)

        // When
        val backendUsageException = assertThrows<BackendUsageException> { getVesselById.execute(vesselId) }

        // Then
        assertThat(backendUsageException.message).isEqualTo("vessel $vesselId not found")
        assertThat(backendUsageException.code).isEqualTo(BackendUsageErrorCode.ENTITY_NOT_FOUND)
    }
}
