package fr.gouv.cacem.monitorenv.domain.use_cases.vessels

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselIdEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IAISPositionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures.AisPositionFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures.VesselFixture.Companion.aVessel
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.verifyNoInteractions
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class GetVesselByShipIdUTest {
    private val vesselRepository: IVesselRepository = mock()
    private val aisPositionRepository: IAISPositionRepository = mock()

    val getVesselByShipId = GetVesselByShipId(vesselRepository, aisPositionRepository)

    @Test
    fun `execute should retrieve a vessel by id and last positions, files and additional information by shipId`(
        log: CapturedOutput,
    ) {
        // Given
        val vesselId = VesselIdEntity(batchId = null, rowNumber = null, shipId = 1)

        val expectedVessel = aVessel(mmsi = "1")
        given(vesselRepository.findVesselByVesselId(vesselId)).willReturn(expectedVessel)
        val aisPositions = mutableListOf(AisPositionFixture.aPosition())
        val from = ZonedDateTime.now().minusHours(12)
        val to = ZonedDateTime.now()
        given(
            aisPositionRepository.findAllByMmsiBetweenDates(
                expectedVessel.mmsi?.toInt()!!,
                from = from,
                to = to,
            ),
        ).willReturn(aisPositions)

        // When
        val vessel = getVesselByShipId.execute(vesselId, from, to)

        // Then
        assertThat(vessel).isEqualTo(expectedVessel.copy(positions = aisPositions))
        assertThat(log.out).contains("GET vessel $vesselId")
    }

    @Test
    fun `execute should retrieve a vessel by id and not last positions by shipId when it is null`(log: CapturedOutput) {
        // Given
        val vesselId = VesselIdEntity(batchId = null, rowNumber = null, shipId = 1)

        val expectedVessel = aVessel(mmsi = null)
        given(vesselRepository.findVesselByVesselId(vesselId)).willReturn(expectedVessel)

        // When
        val vessel = getVesselByShipId.execute(vesselId)

        // Then
        verifyNoInteractions(aisPositionRepository)
        assertThat(vessel).isEqualTo(expectedVessel)
        assertThat(log.out).contains("GET vessel $vesselId")
    }

    @Test
    fun `execute should throw a BackendUsageException when vessel is not found`() {
        // Given
        val shipId = 1
        val vesselId = VesselIdEntity(batchId = null, rowNumber = null, shipId = shipId)

        given(vesselRepository.findVesselByVesselId(vesselId)).willReturn(null)

        // When
        val backendUsageException =
            assertThrows<BackendUsageException> { getVesselByShipId.execute(vesselId) }

        // Then
        assertThat(backendUsageException.message).isEqualTo("vessel $vesselId not found")
        assertThat(backendUsageException.code).isEqualTo(BackendUsageErrorCode.ENTITY_NOT_FOUND)
    }
}
