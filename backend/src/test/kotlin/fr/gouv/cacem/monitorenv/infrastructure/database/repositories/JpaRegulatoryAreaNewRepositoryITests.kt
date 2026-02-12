package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaRegulatoryAreaNewRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaRegulatoryAreaNewRepository: JpaRegulatoryAreaNewRepository

    @Test
    @Transactional
    fun `findAll Should return all regulatoryAreas`() {
        // When
        val regulatoryAreas = jpaRegulatoryAreaNewRepository.findAll()
        assertThat(regulatoryAreas).hasSize(13)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when seafront filter is set to NAMO`() {
        val regulatoryAreas =
            jpaRegulatoryAreaNewRepository.findAll(
                seaFronts = listOf("NAMO"),
            )
        println("regulatoryAreas : $regulatoryAreas")
        assertThat(regulatoryAreas.size).isEqualTo(12)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when seafront filter is set to MED`() {
        // When
        val regulatoryAreas =
            jpaRegulatoryAreaNewRepository.findAll(
                seaFronts = listOf("MED"),
            )

        // Then
        assertThat(regulatoryAreas.size).isEqualTo(1)
    }

    @Test
    @Transactional
    fun `findById Should return specific RegulatoryArea`() {
        // When
        val requestedRegulatoryArea = jpaRegulatoryAreaNewRepository.findById(300)

        // Then
        require(requestedRegulatoryArea !== null)
        assertThat(requestedRegulatoryArea.id).isEqualTo(300)
        assertThat(requestedRegulatoryArea.url).isEqualTo("https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000044019134")
        assertThat(requestedRegulatoryArea.layerName).isEqualTo("RNN_Iroise")
        assertThat(requestedRegulatoryArea.facade).isEqualTo("NAMO")
        assertThat(
            requestedRegulatoryArea.refReg,
        ).isEqualTo(
            "Décret no 2021-1149 du 4 septembre 2021 portant extension du périmètre  et modification de la réglementation de la réserve naturelle nationale d'Iroise (Finistère)",
        )
        assertThat(requestedRegulatoryArea.editionBo).isEqualTo("2021-09-28T00:00:00Z")
        assertThat(requestedRegulatoryArea.editeur).isEqualTo("Alexis Pré")
        assertThat(requestedRegulatoryArea.source).isEqualTo("Histolitt SHOM")
        assertThat(requestedRegulatoryArea.observation).isEqualTo("A valider")
        assertThat(requestedRegulatoryArea.date).isEqualTo("2021-09-04T00:00:00Z")
        assertThat(requestedRegulatoryArea.dureeValidite).isEqualTo("permanent")
        assertThat(requestedRegulatoryArea.temporalite).isEqualTo("permanent")
        assertThat(requestedRegulatoryArea.plan).isEqualTo("PIRC")
        assertThat(requestedRegulatoryArea.polyName).isEqualTo("")
        assertThat(requestedRegulatoryArea.resume).isEqualTo("Partie terrestre RNN d'Iroise")
    }
}
