package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class ExtractAreaUTest {
    private val departementAreaRepository: IDepartmentAreaRepository = mock()
    private val reportingRepository: IReportingRepository = mock()
    private val regulatoryAreaRepository: IRegulatoryAreaRepository = mock()
    private val ampAreaRepository: IAMPRepository = mock()
    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()

    private val extractArea: ExtractArea =
        ExtractArea(
            departementAreaRepository,
            reportingRepository,
            regulatoryAreaRepository,
            ampAreaRepository,
            vigilanceAreaRepository,
        )

    @Test
    fun `execute should return an ExtractedAreaEntity that does not intersect a different area`(log: CapturedOutput) {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        given(departementAreaRepository.findDepartmentFromGeometry(geometry = polygon)).willReturn(null)
        given(reportingRepository.findAllIdsByGeometry(geometry = polygon)).willReturn(listOf())
        given(regulatoryAreaRepository.findAllIdsByGeometry(geometry = polygon)).willReturn(listOf())
        given(ampAreaRepository.findAllIdsByGeometry(geometry = polygon)).willReturn(listOf())
        given(vigilanceAreaRepository.findAllIdsByGeometry(geometry = polygon)).willReturn(listOf())

        // When
        val extractedAreaEntity = extractArea.execute(polygon)

        // Then
        verify(departementAreaRepository).findDepartmentFromGeometry(geometry = polygon)
        verify(reportingRepository).findAllIdsByGeometry(geometry = polygon)
        verify(regulatoryAreaRepository).findAllIdsByGeometry(geometry = polygon)
        verify(ampAreaRepository).findAllIdsByGeometry(geometry = polygon)
        verify(vigilanceAreaRepository).findAllIdsByGeometry(geometry = polygon)

        assertThat(extractedAreaEntity.inseeCode).isNull()
        assertThat(extractedAreaEntity.reportingIds).isEmpty()
        assertThat(extractedAreaEntity.regulatoryAreaIds).isEmpty()
        assertThat(extractedAreaEntity.ampIds).isEmpty()
        assertThat(extractedAreaEntity.vigilanceAreaIds).isEmpty()
        assertThat(log.out).contains("GET extracted area")
    }

    @Test
    fun `execute should return an ExtractedAreaEntity that intersects a different area`() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val inseeCode = "44"
        given(departementAreaRepository.findDepartmentFromGeometry(geometry = polygon)).willReturn(inseeCode)
        val reportings = listOf(1)
        given(reportingRepository.findAllIdsByGeometry(geometry = polygon)).willReturn(reportings)
        val regulatoryAreas = listOf(2)
        given(regulatoryAreaRepository.findAllIdsByGeometry(geometry = polygon)).willReturn(regulatoryAreas)
        val amps = listOf(3)
        given(ampAreaRepository.findAllIdsByGeometry(geometry = polygon)).willReturn(amps)
        val vigilanceAreas = listOf(4)
        given(vigilanceAreaRepository.findAllIdsByGeometry(geometry = polygon)).willReturn(vigilanceAreas)

        // When
        val extractedAreaEntity = extractArea.execute(polygon)

        // Then
        verify(departementAreaRepository).findDepartmentFromGeometry(geometry = polygon)
        verify(reportingRepository).findAllIdsByGeometry(geometry = polygon)
        verify(regulatoryAreaRepository).findAllIdsByGeometry(geometry = polygon)
        verify(ampAreaRepository).findAllIdsByGeometry(geometry = polygon)
        verify(vigilanceAreaRepository).findAllIdsByGeometry(geometry = polygon)

        assertThat(extractedAreaEntity.inseeCode).isEqualTo(inseeCode)
        assertThat(extractedAreaEntity.reportingIds).isEqualTo(reportings)
        assertThat(extractedAreaEntity.regulatoryAreaIds).isEqualTo(regulatoryAreas)
        assertThat(extractedAreaEntity.ampIds).isEqualTo(amps)
        assertThat(extractedAreaEntity.vigilanceAreaIds).isEqualTo(vigilanceAreas)
    }
}
