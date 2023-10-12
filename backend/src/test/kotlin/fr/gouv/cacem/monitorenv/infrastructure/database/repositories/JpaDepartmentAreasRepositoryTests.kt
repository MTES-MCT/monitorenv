package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPoint
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaDepartmentAreasRepositoryTests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaDepartmentAreasRepository: JpaDepartmentAreaRepository

    @Test
    @Transactional
    fun `findDepartmentFromGeometry Should return department from a multipolygon geometry`() {
        // Given
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-3.116349 47.301552, -2.761713 47.648530, -3.552079 47.868476, -3.116349 47.301552)))"
        val geometry = wktReader.read(multipolygonString) as MultiPolygon

        // When
        val requestedDepartment = jpaDepartmentAreasRepository.findDepartmentFromGeometry(geometry)
        // Then
        assertThat(requestedDepartment).isEqualTo("56")
    }

    @Test
    @Transactional
    fun `findDepartmentFromGeometry Should return department from a multipoint geometry`() {
        // Given
        val wktReader = WKTReader()
        val multipointString = "MULTIPOINT ((-3.552079 47.868476),(-4.345579 48.031429))"
        val geometry = wktReader.read(multipointString) as MultiPoint

        // When
        val requestedDepartment = jpaDepartmentAreasRepository.findDepartmentFromGeometry(geometry)
        // Then
        assertThat(requestedDepartment).isEqualTo("29")
    }

    @Test
    @Transactional
    fun `findDepartmentFromGeometry Should return null when there is no intersection with departments`() {
        // Given
        val wktReader = WKTReader()
        val multipointString = "MULTIPOINT ((85.858210 35.407473))"
        val geometry = wktReader.read(multipointString) as MultiPoint

        // When
        val requestedDepartment = jpaDepartmentAreasRepository.findDepartmentFromGeometry(geometry)
        // Then
        assertThat(requestedDepartment).isNull()
    }
}
