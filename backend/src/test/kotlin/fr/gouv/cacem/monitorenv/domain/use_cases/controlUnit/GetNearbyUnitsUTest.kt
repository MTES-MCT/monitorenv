package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.NearbyUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.io.WKTReader
import org.mockito.Mockito
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class GetNearbyUnitsUTest {
    private val controlUnitRepository: IControlUnitRepository = Mockito.mock()
    private val getNearbyUnits: GetNearbyUnits = GetNearbyUnits(controlUnitRepository)

    @Test
    fun `execute should return a list of control units with missions from geometry`(log: CapturedOutput) {
        // Given
        val geom =
            WKTReader().read(
                "MULTIPOINT ((-0.48262439 49.54216518))",
            )
        val from = ZonedDateTime.parse("2025-01-01T00:00:00Z")
        val to = ZonedDateTime.parse("2025-01-08T00:00:00Z")
        val expectedNearbyUnits =
            listOf(
                NearbyUnit(
                    controlUnit = ControlUnitFixture.Companion.aLegacyControlUnit(),
                    missions = listOf(MissionFixture.Companion.aMissionEntity()),
                ),
            )
        given(controlUnitRepository.findNearbyUnits(geom, from, to)).willReturn(
            expectedNearbyUnits,
        )

        // When
        val nearbyUnits = getNearbyUnits.execute(geom, from, to)

        // Then
        verify(controlUnitRepository).findNearbyUnits(geom, from, to)
        Assertions.assertThat(nearbyUnits).containsExactlyElementsOf(expectedNearbyUnits)
        assertThat(log.out).contains("GET nearby unit in area from $from to $to")
    }
}
