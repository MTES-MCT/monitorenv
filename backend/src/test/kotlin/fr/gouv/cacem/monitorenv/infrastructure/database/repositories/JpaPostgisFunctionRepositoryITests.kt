package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import jakarta.transaction.Transactional
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired

class JpaPostgisFunctionRepositoryITests : AbstractDBTests() {

    @Autowired
    private lateinit var jpaPostgisFunctionRepository: JpaPostgisFunctionRepository

    @Test
    @Transactional
    fun `normalizeMultipolygon Should return normalized multipolygon`() {
        // Given
        val polygonThatCrosses180lineButOk = WKTReader().read(
            "MULTIPOLYGON(((169.5414367971761 -12.021383335554233,170.84621026404997 -20.474226402870727,192.99614452466446 -16.801786171979174,191.18757796238393 -7.314652241379889,177.13555525730285 -7.816976931074834,169.5414367971761 -12.021383335554233)))",
        ) as MultiPolygon
        val polygonThatCrosses180lineButNotOk = WKTReader().read(
            "MULTIPOLYGON(((2152.946141283657 47.482021414897076,2153.3382158686177 46.05043975867042,2156.0387926508447 46.18608925819626,2155.1049547602192 47.52469665125105,2152.946141283657 47.482021414897076)))",
        ) as MultiPolygon

        val expectedNormalizedPolygon = WKTReader().read(
            "MULTIPOLYGON(((-7.053858716342802 47.482021414897076,-6.661784131382319 46.05043975867042,-3.961207349155302 46.18608925819626,-4.895045239780757 47.52469665125105,-7.053858716342802 47.482021414897076)))",
        ) as MultiPolygon

        // When
        val untouchedMultipolygon = jpaPostgisFunctionRepository.normalizeMultipolygon(polygonThatCrosses180lineButOk)
        val normalizedMultipolygon = jpaPostgisFunctionRepository.normalizeMultipolygon(
            polygonThatCrosses180lineButNotOk,
        )

        // Then
        assertThat(untouchedMultipolygon).isEqualTo(polygonThatCrosses180lineButOk)
        assertThat(normalizedMultipolygon).isEqualTo(expectedNormalizedPolygon)
    }

    @Test
    @Transactional
    fun `normalizeGeometry Should return normalized geometry`() {
        // Given
        val polygonThatCrosses180lineButOk = WKTReader().read(
            "MULTIPOLYGON(((169.5414367971761 -12.021383335554233,170.84621026404997 -20.474226402870727,192.99614452466446 -16.801786171979174,191.18757796238393 -7.314652241379889,177.13555525730285 -7.816976931074834,169.5414367971761 -12.021383335554233)))",
        ) as MultiPolygon
        val polygonThatCrosses180lineButNotOk = WKTReader().read(
            "MULTIPOLYGON(((2152.946141283657 47.482021414897076,2153.3382158686177 46.05043975867042,2156.0387926508447 46.18608925819626,2155.1049547602192 47.52469665125105,2152.946141283657 47.482021414897076)))",
        ) as MultiPolygon

        val pointOutOfBounds = WKTReader().read("POINT(2152.946141283657 47.482021414897076)") as Point
        val pointInBounds = WKTReader().read("POINT(169.5414367971761 -12.021383335554233)") as Point

        val expectedNormalizedPolygon = WKTReader().read(
            "MULTIPOLYGON(((-7.053858716342802 47.482021414897076,-6.661784131382319 46.05043975867042,-3.961207349155302 46.18608925819626,-4.895045239780757 47.52469665125105,-7.053858716342802 47.482021414897076)))",
        ) as MultiPolygon
        val expectedPointOutOfBoundsNormalized = WKTReader().read("POINT(-7.053858716342802 47.482021414897076)") as Point
        // When
        val untouchedMultipolygon = jpaPostgisFunctionRepository.normalizeMultipolygon(polygonThatCrosses180lineButOk)
        val normalizedMultipolygon = jpaPostgisFunctionRepository.normalizeMultipolygon(
            polygonThatCrosses180lineButNotOk,
        )

        // Then
        assertThat(untouchedMultipolygon).isEqualTo(polygonThatCrosses180lineButOk)
        assertThat(normalizedMultipolygon).isEqualTo(expectedNormalizedPolygon)
        assertThat(jpaPostgisFunctionRepository.normalizeGeometry(pointOutOfBounds)).isEqualTo(
            expectedPointOutOfBoundsNormalized,
        )
        assertThat(jpaPostgisFunctionRepository.normalizeGeometry(pointInBounds)).isEqualTo(pointInBounds)
    }
}
