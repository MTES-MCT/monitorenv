package fr.gouv.cacem.monitorenv.domain.use_cases.amps

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.amp.fixtures.AmpFixture.Companion.anAmp
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetAllAMPsByIdsUTest {
    private val ampRepository: IAMPRepository = mock()
    private val getAMPsByIds = GetAllAMPsByIds(ampRepository)

    val wktReader = WKTReader()
    val multipolygonString =
        "MULTIPOLYGON(((-7.053858716342802 47.482021414897076,-6.661784131382319 46.05043975867042,-3.961207349155302 46.18608925819626,-4.895045239780757 47.52469665125105,-7.053858716342802 47.482021414897076)))"
    val polygon = wktReader.read(multipolygonString) as MultiPolygon

    @Test
    fun `execute should return all amps that match ids`() {
        // Given
        val expectedAmps = listOf(anAmp(id = 1), anAmp(id = 2, geom = polygon))
        val ids = listOf(1, 2)
        given(ampRepository.findAllByIds(ids, "NORTH_SOUTH")).willReturn(expectedAmps)

        // When
        val amps = getAMPsByIds.execute(ids, "NORTH_SOUTH")

        // Then
        assertThat(amps).isEqualTo(expectedAmps)
        assertThat(amps[0].id).isEqualTo(1)
        assertThat(amps[1].id).isEqualTo(2)
    }
}
