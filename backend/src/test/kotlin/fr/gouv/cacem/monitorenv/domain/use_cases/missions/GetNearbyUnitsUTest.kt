package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.NearbyUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitFixture.Companion.aLegacyControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.io.WKTReader
import org.mockito.Mockito.mock

class GetNearbyUnitsUTest {
    private val controlUnitRepository: IControlUnitRepository = mock()
    private val getNearbyUnits: GetNearbyUnits = GetNearbyUnits(controlUnitRepository)

    @Test
    fun `execute should return a list of control units with missions from geometry`() {
        // Given
        val geom =
            WKTReader().read(
                "MULTIPOINT ((-0.48262439 49.54216518))",
            )
        val expectedNearbyUnits =
            listOf(
                NearbyUnit(
                    controlUnit = aLegacyControlUnit(),
                    missions = listOf(aMissionEntity()),
                ),
            )
        given(controlUnitRepository.findNearbyUnits(geom)).willReturn(
            expectedNearbyUnits,
        )

        // When
        val nearbyUnits = getNearbyUnits.execute(geom)

        // Then
        verify(controlUnitRepository).findNearbyUnits(geom)
        assertThat(nearbyUnits).containsExactlyElementsOf(expectedNearbyUnits)
    }
}
