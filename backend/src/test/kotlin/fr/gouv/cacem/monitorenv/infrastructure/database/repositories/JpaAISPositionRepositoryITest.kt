package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures.AisPositionFixture
import fr.gouv.cacem.monitorenv.infrastructure.database.model.AISPositionPK
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAISPositionRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import java.time.ZonedDateTime

class JpaAISPositionRepositoryITest : AbstractDBTests() {
    @Autowired
    lateinit var jpaAISPositionRepository: JpaAISPositionRepository

    @Autowired
    lateinit var idbaisPositionRepository: IDBAISPositionRepository

    @Test
    fun `saveAll should save the entities`() {
        // Given
        val ts = ZonedDateTime.now()
        val mmsi = 123456789
        val aisPayloads = listOf(AisPositionFixture.aMessagePayload(ts = ts, mmsi = mmsi))

        // When
        jpaAISPositionRepository.saveAll(aisPayloads)

        // Then
        assertThat(idbaisPositionRepository.findByIdOrNull(AISPositionPK(ts = ts, mmsi = mmsi))).isNotNull()
    }

    @Test
    fun `findAllByMmsiBetweenDates should return all entities between those dates for given mmsi`() {
        // Given
        val mmsi = 123456789
        val from = ZonedDateTime.now().minusDays(3)
        val to = ZonedDateTime.now()

        // When
        val positions = jpaAISPositionRepository.findAllByMmsiBetweenDates(mmsi, from, to)

        // Then
        assertThat(positions).isNotEmpty()
    }
}
