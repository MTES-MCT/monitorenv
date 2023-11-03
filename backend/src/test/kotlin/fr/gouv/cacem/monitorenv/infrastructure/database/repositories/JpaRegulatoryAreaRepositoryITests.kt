package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaRegulatoryAreaRepositoryITests : AbstractDBTests() {

    @Autowired private lateinit var jpaRegulatoryAreasRepository: JpaRegulatoryAreaRepository

    @Test
    @Transactional
    fun `findAll Should return all regulatoryAreas`() {
        // When
        val regulatoryAreas = jpaRegulatoryAreasRepository.findAll()
        assertThat(regulatoryAreas).hasSize(13)
    }

    @Test
    @Transactional
    fun `findById Should return specific RegulatoryArea`() {
        // Given
        val WKTreader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
        val Polygon = WKTreader.read(multipolygonString) as MultiPolygon
        val searchedRegulatoryArea =
            RegulatoryAreaModel.fromRegulatoryAreaEntity(
                RegulatoryAreaEntity(
                    id = 17,
                    geom = Polygon,
                    entity_name = "Zone au sud de la cale",
                    url =
                    "http://extranet.legicem.metier.developpement-durable.gouv.fr/zmel-roscanvel-a3474.html?id_rub=1098",
                    layer_name = "ZMEL_Cale_Querlen",
                    facade = "NAMO",
                    ref_reg =
                    "Arrêté inter-préfectoral N°2020118-0003 autorisant l'occupation temporaire du domaine public maritime par une zone de mouillages et d'équipements légers au lit-dit \"Cale de Quérlen\" sur le littoral de la commune de Roscanvel ",
                    edition = "2021-11-02",
                    editeur = "Alexis Pré",
                    source = "",
                    observation = "",
                    thematique = "Mouillage, PN",
                    echelle = "1:1000",
                    date = "2020-07-01",
                    duree_validite = "15 ans",
                    date_fin = "2035-07-01",
                    temporalite = "temporaire",
                    objet = "",
                    signataire = ""
                )
            )

        // When
        val requestedRegulatoryArea = jpaRegulatoryAreasRepository.findById(17)
        // Then
        assertThat(requestedRegulatoryArea.id).isEqualTo(searchedRegulatoryArea.id)
        assertThat(requestedRegulatoryArea.geom).isEqualTo(searchedRegulatoryArea.geom)
        assertThat(requestedRegulatoryArea.entity_name)
            .isEqualTo(searchedRegulatoryArea.entity_name)
        assertThat(requestedRegulatoryArea.url).isEqualTo(searchedRegulatoryArea.url)
        assertThat(requestedRegulatoryArea.layer_name).isEqualTo(searchedRegulatoryArea.layer_name)
        assertThat(requestedRegulatoryArea.facade).isEqualTo(searchedRegulatoryArea.facade)
        assertThat(requestedRegulatoryArea.ref_reg).isEqualTo(searchedRegulatoryArea.ref_reg)
        assertThat(requestedRegulatoryArea.edition).isEqualTo(searchedRegulatoryArea.edition)
        assertThat(requestedRegulatoryArea.editeur).isEqualTo(searchedRegulatoryArea.editeur)
        assertThat(requestedRegulatoryArea.source).isEqualTo(searchedRegulatoryArea.source)
        assertThat(requestedRegulatoryArea.observation)
            .isEqualTo(searchedRegulatoryArea.observation)
        assertThat(requestedRegulatoryArea.thematique).isEqualTo(searchedRegulatoryArea.thematique)
        assertThat(requestedRegulatoryArea.echelle).isEqualTo(searchedRegulatoryArea.echelle)
        assertThat(requestedRegulatoryArea.date).isEqualTo(searchedRegulatoryArea.date)
        assertThat(requestedRegulatoryArea.duree_validite)
            .isEqualTo(searchedRegulatoryArea.duree_validite)
        assertThat(requestedRegulatoryArea.date_fin).isEqualTo(searchedRegulatoryArea.date_fin)
        assertThat(requestedRegulatoryArea.temporalite)
            .isEqualTo(searchedRegulatoryArea.temporalite)
        assertThat(requestedRegulatoryArea.observation)
            .isEqualTo(searchedRegulatoryArea.observation)
        assertThat(requestedRegulatoryArea.objet).isEqualTo(searchedRegulatoryArea.objet)
        assertThat(requestedRegulatoryArea.signataire).isEqualTo(searchedRegulatoryArea.signataire)
    }

    @Test
    fun `count should return total number of regulatory areas in db`() {
        val numberOfRegulatoryAreas = jpaRegulatoryAreasRepository.count()
        assertThat(numberOfRegulatoryAreas).isEqualTo(13)
    }
}
