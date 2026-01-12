package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagModel.Companion.fromTagEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaPk
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaRegulatoryAreaRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaRegulatoryAreasRepository: JpaRegulatoryAreaRepository

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
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
        val searchedRegulatoryArea =
            RegulatoryAreaModel(
                id = 17,
                geom = polygon,
                url =
                    "http://extranet.legicem.metier.developpement-durable.gouv.fr/zmel-roscanvel-a3474.html?id_rub=1098",
                layerName = "ZMEL_Cale_Querlen",
                facade = "NAMO",
                refReg =
                    "Arrêté inter-préfectoral N°2020118-0003 autorisant l'occupation temporaire du domaine public maritime par une zone de mouillages et d'équipements légers au lit-dit \"Cale de Quérlen\" sur le littoral de la commune de Roscanvel",
                edition = "2021-11-02",
                editeur = "Alexis Pré",
                source = "",
                observation = "",
                type = null,
                tags = listOf(),
                date = "2020-07-01",
                dureeValidite = "15 ans",
                dateFin = "2035-07-01",
                temporalite = "temporaire",
                themes = listOf(),
                plan = "PIRC, PSCEM",
                polyName = "",
                resume = "Zone au sud de la cale",
            )
        val themes =
            listOf(
                aTag(name = "Mouillage"),
                aTag(name = "PN"),
            )
        searchedRegulatoryArea.tags =
            themes.map {
                TagRegulatoryAreaModel(
                    id = TagRegulatoryAreaPk(tagId = it.id, regulatoryAreaId = 17),
                    tag = fromTagEntity(it),
                    regulatoryArea = searchedRegulatoryArea,
                )
            }

        // When
        val requestedRegulatoryArea = jpaRegulatoryAreasRepository.findById(17)

        // Then
        require(requestedRegulatoryArea !== null)
        assertThat(requestedRegulatoryArea.id).isEqualTo(searchedRegulatoryArea.id)
        assertThat(requestedRegulatoryArea.geom).isEqualTo(searchedRegulatoryArea.geom)
        assertThat(requestedRegulatoryArea.url).isEqualTo(searchedRegulatoryArea.url)
        assertThat(requestedRegulatoryArea.layerName).isEqualTo(searchedRegulatoryArea.layerName)
        assertThat(requestedRegulatoryArea.facade).isEqualTo(searchedRegulatoryArea.facade)
        assertThat(requestedRegulatoryArea.refReg).isEqualTo(searchedRegulatoryArea.refReg)
        assertThat(requestedRegulatoryArea.edition).isEqualTo(searchedRegulatoryArea.edition)
        assertThat(requestedRegulatoryArea.editeur).isEqualTo(searchedRegulatoryArea.editeur)
        assertThat(requestedRegulatoryArea.source).isEqualTo(searchedRegulatoryArea.source)
        assertThat(requestedRegulatoryArea.observation).isEqualTo(searchedRegulatoryArea.observation)
        assertThat(requestedRegulatoryArea.tags).hasSameSizeAs(searchedRegulatoryArea.tags)
        assertThat(requestedRegulatoryArea.tags[0].name).isEqualTo("PN")
        assertThat(requestedRegulatoryArea.tags[0].subTags[0].name).isEqualTo("subtagPN2")
        assertThat(requestedRegulatoryArea.tags[1].name).isEqualTo("Mouillage")
        assertThat(requestedRegulatoryArea.tags[1].subTags[0].name).isEqualTo("subtagMouillage1")
        assertThat(requestedRegulatoryArea.date).isEqualTo(searchedRegulatoryArea.date)
        assertThat(requestedRegulatoryArea.dureeValidite).isEqualTo(searchedRegulatoryArea.dureeValidite)
        assertThat(requestedRegulatoryArea.dateFin).isEqualTo(searchedRegulatoryArea.dateFin)
        assertThat(requestedRegulatoryArea.temporalite).isEqualTo(searchedRegulatoryArea.temporalite)
        assertThat(requestedRegulatoryArea.plan).isEqualTo(searchedRegulatoryArea.plan)
        assertThat(requestedRegulatoryArea.polyName).isEqualTo(searchedRegulatoryArea.polyName)
        assertThat(requestedRegulatoryArea.resume).isEqualTo(searchedRegulatoryArea.resume)
    }

    @Test
    fun `count should return total number of regulatory areas in db`() {
        val numberOfRegulatoryAreas = jpaRegulatoryAreasRepository.count()
        assertThat(numberOfRegulatoryAreas).isEqualTo(13)
    }

    @Test
    fun `findAllByGeometry should return all regulatory areas that intersect the geometry `() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-5.09960369 48.32482523, -4.88569684 48.32505046, -4.93672119 48.47387673, -5.12651574 48.45876889, -5.09960369 48.32482523)), \n" +
                "((-3.57357208 48.97647554, -3.34729792 49.03663561, -3.31147549 48.82323819, -3.46975201 48.81968417, -3.57357208 48.97647554)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        // When
        val regulatoryAreas = jpaRegulatoryAreasRepository.findAllIdsByGeometry(polygon)

        // Then
        assertThat(regulatoryAreas).hasSize(4)
        assertThat(regulatoryAreas[0]).isEqualTo(425)
        assertThat(regulatoryAreas[1]).isEqualTo(134)
        assertThat(regulatoryAreas[2]).isEqualTo(300)
        assertThat(regulatoryAreas[3]).isEqualTo(625)
    }
}
