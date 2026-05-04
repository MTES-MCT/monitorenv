package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.*
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class ExtractAreaUTest {
    private val departementAreaRepository: IDepartmentAreaRepository = mock()
    private val reportingRepository: IReportingRepository = mock()
    private val regulatoryAreaRepository: IRegulatoryAreaRepository = mock()
    private val ampAreaRepository: IAMPRepository = mock()
    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()
    private val tagRepository: ITagRepository = mock()
    private val themeRepository: IThemeRepository = mock()

    private val extractArea: ExtractArea =
        ExtractArea(
            departementAreaRepository,
            reportingRepository,
            regulatoryAreaRepository,
            ampAreaRepository,
            vigilanceAreaRepository,
            tagRepository,
            themeRepository,
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
        given(vigilanceAreaRepository.findAllIdsByGeometryAndIsDraftIsFalse(geometry = polygon)).willReturn(listOf())
        given(tagRepository.findAllWithinByRegulatoryAreaIds(listOf())).willReturn(listOf())
        given(tagRepository.findAllWithinByVigilanceAreasIds(listOf())).willReturn(listOf())
        given(themeRepository.findAllWithinByRegulatoryAreaIds(listOf())).willReturn(listOf())
        given(themeRepository.findAllWithinByVigilanceAreasIds(listOf())).willReturn(listOf())
        // When
        val extractedAreaEntity = extractArea.execute(polygon)

        // Then
        verify(departementAreaRepository).findDepartmentFromGeometry(geometry = polygon)
        verify(reportingRepository).findAllIdsByGeometry(geometry = polygon)
        verify(regulatoryAreaRepository).findAllIdsByGeometry(geometry = polygon)
        verify(ampAreaRepository).findAllIdsByGeometry(geometry = polygon)
        verify(vigilanceAreaRepository).findAllIdsByGeometryAndIsDraftIsFalse(geometry = polygon)

        assertThat(extractedAreaEntity.inseeCode).isNull()
        assertThat(extractedAreaEntity.reportingIds).isEmpty()
        assertThat(extractedAreaEntity.regulatoryAreaIds).isEmpty()
        assertThat(extractedAreaEntity.ampIds).isEmpty()
        assertThat(extractedAreaEntity.vigilanceAreaIds).isEmpty()
        assertThat(extractedAreaEntity.tags).isEmpty()
        assertThat(extractedAreaEntity.themes).isEmpty()
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
        given(vigilanceAreaRepository.findAllIdsByGeometryAndIsDraftIsFalse(geometry = polygon)).willReturn(
            vigilanceAreas,
        )
        given(tagRepository.findAllWithinByRegulatoryAreaIds(any(), any())).willReturn(
            listOf(aTag(id = 1)),
        )
        given(tagRepository.findAllWithinByVigilanceAreasIds(any(), any())).willReturn(listOf(aTag(id = 2)))
        given(
            themeRepository.findAllWithinByRegulatoryAreaIds(any(), any()),
        ).willReturn(listOf(aTheme(id = 1, startedAt = ZonedDateTime.parse("2022-01-23T20:29:03Z"))))
        given(
            themeRepository.findAllWithinByVigilanceAreasIds(any(), any()),
        ).willReturn(listOf(aTheme(id = 1, startedAt = ZonedDateTime.parse("2022-01-23T20:29:03Z"))))

        // When
        val extractedAreaEntity = extractArea.execute(polygon)

        // Then
        verify(departementAreaRepository).findDepartmentFromGeometry(geometry = polygon)
        verify(reportingRepository).findAllIdsByGeometry(geometry = polygon)
        verify(regulatoryAreaRepository).findAllIdsByGeometry(geometry = polygon)
        verify(ampAreaRepository).findAllIdsByGeometry(geometry = polygon)
        verify(vigilanceAreaRepository).findAllIdsByGeometryAndIsDraftIsFalse(geometry = polygon)

        assertThat(extractedAreaEntity.inseeCode).isEqualTo(inseeCode)
        assertThat(extractedAreaEntity.reportingIds).isEqualTo(reportings)
        assertThat(extractedAreaEntity.regulatoryAreaIds).isEqualTo(regulatoryAreas)
        assertThat(extractedAreaEntity.ampIds).isEqualTo(amps)
        assertThat(extractedAreaEntity.vigilanceAreaIds).isEqualTo(vigilanceAreas)
        assertThat(extractedAreaEntity.tags).hasSize(2)
        assertThat(extractedAreaEntity.themes).hasSize(1)
    }
}
