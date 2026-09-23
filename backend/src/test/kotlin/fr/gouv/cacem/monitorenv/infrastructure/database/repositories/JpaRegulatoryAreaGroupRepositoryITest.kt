package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

class JpaRegulatoryAreaGroupRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaRegulatoryAreaGroupRepository: JpaRegulatoryAreaGroupRepository

    @Test
    @Transactional
    fun `findAll Should return all regulatoryAreas`() {
        // When
        val regulatoryAreas = jpaRegulatoryAreaGroupRepository.findAll(SearchFilters())
        assertThat(regulatoryAreas.size).isEqualTo(9)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when onlyRecentsArea filter is set to TRUE`() {
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                filters = SearchFilters(onlyRecentsAreas = true),
            )
        assertThat(regulatoryAreas.size).isEqualTo(8)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when seafront filter is set to NAMO`() {
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                filters = SearchFilters(seaFronts = listOf("NAMO")),
            )
        assertThat(regulatoryAreas.size).isEqualTo(8)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when query filter is set to Dragage`() {
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                filters = SearchFilters(query = "Dragage"),
            )
        assertThat(regulatoryAreas).hasSize(1)
        assertThat(regulatoryAreas[0].areas).hasSize(2)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when lastModification filter is set to in a month`() {
        val lastModificationFrom = ZonedDateTime.now().minusDays(30)
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                SearchFilters(
                    lastModificationFrom = lastModificationFrom.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                ),
            )
        assertThat(regulatoryAreas).hasSize(4)
        assertThat(regulatoryAreas.flatMap { it.areas }.map { it.editionBo }).allMatch {
            it?.isBefore(
                lastModificationFrom,
            ) == true
        }
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when lastModification custom filter is set`() {
        val lastModificationFrom = ZonedDateTime.now().plusDays(1)
        val lastModificationTo = ZonedDateTime.now().minusDays(1)
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                SearchFilters(
                    lastModificationFrom = lastModificationFrom.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                    lastModificationTo = lastModificationTo.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                ),
            )
        assertThat(regulatoryAreas).hasSize(3)
        assertThat(regulatoryAreas.flatMap { it.areas }).hasSize(4)
        assertThat(regulatoryAreas.flatMap { it.areas }.map { it.editionBo }).allMatch {
            it?.isBefore(
                lastModificationFrom,
            ) == true &&
                it.isAfter(lastModificationTo)
        }
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when seafront filter is set to MED`() {
        // When
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                filters = SearchFilters(seaFronts = listOf("MED")),
            )

        // Then
        assertThat(regulatoryAreas.size).isEqualTo(1)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when tags filter is set to 'subtagMouillage1'`() {
        // When
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(SearchFilters(tags = listOf(10)))

        // Then
        assertThat(regulatoryAreas.size).isEqualTo(2)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when themes filter is set to 'Pêche à pied'`() {
        // When
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(SearchFilters(themes = listOf(9)))

        // Then
        assertThat(regulatoryAreas.size).isEqualTo(1)
    }

    @Test
    fun `findAllLayerNames should return all layer names`() {
        // When
        val layerNames = jpaRegulatoryAreaGroupRepository.findAllLayerNames()

        // Then
        assertThat(layerNames).hasSize(9)
        assertThat(layerNames.map { it.group.layerName + " - " + it.group.location }).containsExactlyInAnyOrder(
            "Dragage - port de Brest",
            "Granulats Marins - Le Minou",
            "Interdiction VNM - Molene",
            "Mouillage - Conquet Ile de bannec",
            "Mouillage interdiction - port Camaret",
            "RNN - Iroise",
            "ZMEL - anse illien Ploumoguer",
            "ZMEL - Cale Querlen",
            "ZMEL - maison blanche",
        )
    }
}
