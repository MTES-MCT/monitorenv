package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPoint
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaFacadeAreasRepositoryTests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaFacadeAreasRepository: JpaFacadeAreasRepository

    @Test
    @Transactional
    fun `findFacadeFromGeometry Should return facade from a multipolygon geometry`() {
        // Given
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
        val geometry = wktReader.read(multipolygonString) as MultiPolygon

        // When
        val requestedFacade = jpaFacadeAreasRepository.findFacadeFromGeometry(geometry)
        // Then
        assertThat(requestedFacade).isEqualTo("NAMO")
    }

    @Test
    @Transactional
    fun `findFacadeFromGeometry Should return facade from a multipoint geometry`() {
        // Given
        val wktReader = WKTReader()
        val multipointString =
            "MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"
        val geometry = wktReader.read(multipointString) as MultiPoint

        // When
        val requestedFacade = jpaFacadeAreasRepository.findFacadeFromGeometry(geometry)
        // Then
        assertThat(requestedFacade).isEqualTo("SA")
    }

    @Test
    @Transactional
    fun `findFacadeFromGeometry Should return null when there is no intersection with facades`() {
        // Given
        val wktReader = WKTReader()
        val multipointString =
            "MULTIPOINT ((85.858210 35.407473))"
        val geometry = wktReader.read(multipointString) as MultiPoint

        // When
        val requestedFacade = jpaFacadeAreasRepository.findFacadeFromGeometry(geometry)
        // Then
        assertThat(requestedFacade).isNull()
    }
}
