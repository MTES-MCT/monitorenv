package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaAMPRepositoryTests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaAMPRepository: JpaAMPRepository

    @Test
    @Transactional
    fun `findAll Should return all amps`() {
        // When
        val amps = jpaAMPRepository.findAll(false)
        assertThat(amps).hasSize(20)
    }

    @Test
    fun `findAllByGeometry should return all amps that intersect the geometry `() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-1.25226339 44.64863611, -1.23913338 44.63616517, -1.22283621 44.62575435, -1.20399816 44.61780494, -1.18334319 44.61262348, -1.16166503 44.61040987, -1.13979678 44.6112495, -1.11857883 44.61510998, -1.09882655 44.62184238, -1.08129902 44.63118702, -1.06666982 44.64278365, -1.05550114 44.65618539, -1.04822218 44.67087619, -1.04511267 44.6862907, -1.0462921 44.70183624, -1.05171516 44.71691551, -1.06117343 44.73094961, -1.07430345 44.74340017, -1.09060062 44.75378986, -1.10943866 44.76172063, -1.13009364 44.76688876, -1.15177179 44.76909641, -1.17364004 44.76825906, -1.194858 44.76440877, -1.21461028 44.75769293, -1.2321378 44.74836868, -1.246767 44.73679318, -1.25793569 44.72341007, -1.26521465 44.7087326, -1.26832416 44.69332405, -1.26714472 44.67777623, -1.26172167 44.66268677, -1.25226339 44.64863611)), \n" +
                "((-1.40432384 45.84068455, -1.09469711 46.03630509, -1.11309675 45.71106089, -1.40432384 45.84068455)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        // When
        val amps = jpaAMPRepository.findAllIdsByGeometry(polygon)

        // Then
        assertThat(amps).hasSize(1)
        assertThat(amps[0]).isEqualTo(12)
    }
}
