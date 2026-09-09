package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaRegulatoryAreaGroupRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaRegulatoryAreaGroupRepository: JpaRegulatoryAreaGroupRepository

    @Test
    @Transactional
    fun `findAll Should return all regulatoryAreas`() {
        // When
        val regulatoryAreas = jpaRegulatoryAreaGroupRepository.findAll()
        assertThat(regulatoryAreas.size).isEqualTo(9)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when onlyRecentsArea filter is set to TRUE`() {
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                controlPlan = null,
                seaFronts = null,
                tags = null,
                themes = null,
                onlyRecentsAreas = true,
            )
        assertThat(regulatoryAreas.size).isEqualTo(8)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when seafront filter is set to NAMO`() {
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                controlPlan = null,
                seaFronts = listOf("NAMO"),
                tags = null,
                themes = null,
            )
        assertThat(regulatoryAreas.size).isEqualTo(8)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when seafront filter is set to MED`() {
        // When
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                controlPlan = null,
                seaFronts = listOf("MED"),
                tags = null,
                themes = null,
            )

        // Then
        assertThat(regulatoryAreas.size).isEqualTo(1)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when tags filter is set to 'subtagMouillage1'`() {
        // When
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                controlPlan = null,
                seaFronts = null,
                tags = listOf(10),
                themes = null,
            )

        // Then
        assertThat(regulatoryAreas.size).isEqualTo(2)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when themes filter is set to 'Pêche à pied'`() {
        // When
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                controlPlan = null,
                seaFronts = null,
                tags = null,
                themes = listOf(9),
            )

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
