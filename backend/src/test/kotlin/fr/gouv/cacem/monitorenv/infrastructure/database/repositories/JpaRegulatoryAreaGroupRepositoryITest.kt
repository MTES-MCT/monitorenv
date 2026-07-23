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

        println("Layer names: $layerNames")
        // Then
        assertThat(layerNames).hasSize(9)
        assertThat(layerNames.keys).containsExactlyInAnyOrder(
            "Dragage_port_de_Brest",
            "Granulats_Marins_Le_Minou",
            "Interdiction_VNM_Molene",
            "Mouillage_Conquet_Ile_de_bannec",
            "Mouillage_interdiction_port_Camaret",
            "RNN_Iroise",
            "ZMEL_anse_illien_Ploumoguer",
            "ZMEL_Cale_Querlen",
            "ZMEL_maison_blanche",
        )
    }
}
