package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.amp.fixtures.AmpFixture.Companion.anAmp
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryArea.fixtures.RegulatoryAreaFixture.Companion.aRegulatoryArea
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures.VigilanceAreaFixture.Companion.aVigilanceAreaEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.Mockito.mock

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
    fun `execute should return an ExtractedAreaEntity that does not intersect a different area`() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        given(departementAreaRepository.findDepartmentFromGeometry(geometry = polygon)).willReturn(null)
        given(reportingRepository.findAllByGeometry(geometry = polygon)).willReturn(listOf())
        given(regulatoryAreaRepository.findAllByGeometry(geometry = polygon)).willReturn(listOf())
        given(ampAreaRepository.findAllByGeometry(geometry = polygon)).willReturn(listOf())
        given(vigilanceAreaRepository.findAllByGeometry(geometry = polygon)).willReturn(listOf())

        // When
        val extractedAreaEntity = extractArea.execute(polygon)

        // Then
        verify(departementAreaRepository).findDepartmentFromGeometry(geometry = polygon)
        verify(reportingRepository).findAllByGeometry(geometry = polygon)
        verify(regulatoryAreaRepository).findAllByGeometry(geometry = polygon)
        verify(ampAreaRepository).findAllByGeometry(geometry = polygon)
        verify(vigilanceAreaRepository).findAllByGeometry(geometry = polygon)

        assertThat(extractedAreaEntity.inseeCode).isNull()
        assertThat(extractedAreaEntity.reportings).isEmpty()
        assertThat(extractedAreaEntity.regulatoryAreas).isEmpty()
        assertThat(extractedAreaEntity.amps).isEmpty()
        assertThat(extractedAreaEntity.vigilanceAreas).isEmpty()
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
        val reportings = listOf(aReportingDTO())
        given(reportingRepository.findAllByGeometry(geometry = polygon)).willReturn(reportings)
        val regulatoryAreas = listOf(aRegulatoryArea())
        given(regulatoryAreaRepository.findAllByGeometry(geometry = polygon)).willReturn(regulatoryAreas)
        val amps = listOf(anAmp())
        given(ampAreaRepository.findAllByGeometry(geometry = polygon)).willReturn(amps)
        val vigilanceAreas = listOf(aVigilanceAreaEntity())
        given(vigilanceAreaRepository.findAllByGeometry(geometry = polygon)).willReturn(vigilanceAreas)

        // When
        val extractedAreaEntity = extractArea.execute(polygon)

        // Then
        verify(departementAreaRepository).findDepartmentFromGeometry(geometry = polygon)
        verify(reportingRepository).findAllByGeometry(geometry = polygon)
        verify(regulatoryAreaRepository).findAllByGeometry(geometry = polygon)
        verify(ampAreaRepository).findAllByGeometry(geometry = polygon)
        verify(vigilanceAreaRepository).findAllByGeometry(geometry = polygon)

        assertThat(extractedAreaEntity.inseeCode).isEqualTo(inseeCode)
        assertThat(extractedAreaEntity.reportings).isEqualTo(reportings)
        assertThat(extractedAreaEntity.regulatoryAreas).isEqualTo(regulatoryAreas)
        assertThat(extractedAreaEntity.amps).isEqualTo(amps)
        assertThat(extractedAreaEntity.vigilanceAreas).isEqualTo(vigilanceAreas)
    }
}
