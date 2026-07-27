package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaRegulatoryAreaGroupRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaRegulatoryAreaGroupRepository: JpaRegulatoryAreaGroupRepository

    @Test
    fun `findAllLayerNames should return all layer names`() {
        // When
        val layerNames = jpaRegulatoryAreaGroupRepository.findAllLayerNames()

        // Then
        assertThat(layerNames).hasSize(9)
        assertThat(layerNames.keys).containsExactlyInAnyOrder(
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
