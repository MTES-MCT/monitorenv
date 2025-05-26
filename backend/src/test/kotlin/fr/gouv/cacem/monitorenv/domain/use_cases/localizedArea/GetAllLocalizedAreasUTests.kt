package fr.gouv.cacem.monitorenv.domain.use_cases.localizedArea

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.entities.localizedArea.LocalizedAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ILocalizedAreasRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetAllLocalizedAreasUTests {
    private val localizedAreasRepository: ILocalizedAreasRepository = mock()
    private val getAllLocalizedAreas = GetAllLocalizedAreas(localizedAreasRepository)

    val wktReader = WKTReader()

    val multipolygonString =
        "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
    val polygon = wktReader.read(multipolygonString) as MultiPolygon

    @Test
    fun `execute should return all localized areas`(log: CapturedOutput) {
        // Given
        val expectedLocalizedAreas =
            listOf(
                LocalizedAreaEntity(
                    id = 1,
                    name = "Area 1",
                    geom = polygon,
                    controlUnitIds = listOf(1, 2),
                    ampIds = listOf(3, 4),
                ),
            )
        given(localizedAreasRepository.findAll()).willReturn(expectedLocalizedAreas)

        // When
        val localizedAreas = getAllLocalizedAreas.execute()

        // Then
        assertThat(expectedLocalizedAreas).isEqualTo(localizedAreas)
        assertThat(log.out).contains("Attempt to GET all localized areas")
        assertThat(log.out).contains("Found ${localizedAreas.size} localized areas")
    }
}
