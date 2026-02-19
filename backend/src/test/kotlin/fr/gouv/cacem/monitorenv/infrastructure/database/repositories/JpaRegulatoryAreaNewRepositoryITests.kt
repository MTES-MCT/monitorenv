package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

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
                tags = null,
                themes = null,
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
            jpaRegulatoryAreaNewRepository.findAll(
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
            jpaRegulatoryAreaNewRepository.findAll(
                seaFronts = null,
                tags = null,
                themes = listOf(9),
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

    @Test
    fun `findAllLayerNames should return all layer names`() {
        // When
        val layerNames = jpaRegulatoryAreaNewRepository.findAllLayerNames()

        println("Layer names: $layerNames")
        // Then
        assertThat(layerNames).hasSize(9)
        assertThat(layerNames.keys).containsExactlyInAnyOrder(
            "",
            "Dragage_port_de_Brest",
            "Interdiction_VNM_Molene",
            "Mouillage_Conquet_Ile_de_bannec",
            "Mouillage_interdiction_port_Camaret",
            "RNN_Iroise",
            "ZMEL_anse_illien_Ploumoguer",
            "ZMEL_Cale_Querlen",
            "ZMEL_maison_blanche",
        )
    }

    @Test
    fun `findAllToComplete should return all regulatory areas to create`() {
        // When
        val regulatoryAreasToComplete = jpaRegulatoryAreaNewRepository.findAllToComplete()
        // Then
        assertThat(regulatoryAreasToComplete).hasSize(2)
        assertThat(regulatoryAreasToComplete[0].id).isEqualTo(123)
        assertThat(regulatoryAreasToComplete[0].geom).isNotNull()
        assertThat(
            regulatoryAreasToComplete[0].refReg,
        ).isEqualTo(
            "Arrêté inter-préfectoral N°2028118-0159 autorisant l'occupation temporaire du domaine public maritime vers Ajaccio",
        )
        assertThat(regulatoryAreasToComplete[0].creation).isNull()
        assertThat(regulatoryAreasToComplete[1].id).isEqualTo(456)
        assertThat(regulatoryAreasToComplete[1].geom).isNotNull()
        assertThat(regulatoryAreasToComplete[1].refReg).isEqualTo("Délibération interdisant la pêche à pied")
        assertThat(regulatoryAreasToComplete[1].creation).isNull()
    }

    @Test
    @Transactional
    fun `save should create regulatory area with tags and themes`() {
        val wktReader = WKTReader()
        val geom =
            wktReader.read(
                "MULTIPOLYGON (((-4.54877 48.305, -4.54727 48.305, -4.54727 48.304, -4.54877 48.304, -4.54877 48.305)))",
            ) as MultiPolygon

        val regulatoryArea =
            RegulatoryAreaNewEntity(
                id = 9999,
                layerName = "Test_Area",
                facade = "NAMO",
                refReg = "Arrêté test pour création",
                resume = "Zone de test",
                geom = geom,
                url = "https://example.com",
                source = "Test Source",
                editeur = "Test Editor",
                observation = "Test observation",
                date = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                dureeValidite = "permanent",
                temporalite = "permanent",
                plan = "TEST",
                polyName = "Test Polygon",
                tags = listOf(aTag(id = 5)),
                themes = listOf(aTheme(id = 9)),
                editionBo = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                creation = null,
                dateFin = null,
                editionCacem = null,
                authorizationPeriods = null,
                prohibitionPeriods = null,
                type = null,
                othersRefReg = null,
            )

        val savedRegulatoryArea = jpaRegulatoryAreaNewRepository.save(regulatoryArea)

        assertThat(savedRegulatoryArea.id).isEqualTo(9999)
        assertThat(savedRegulatoryArea.layerName).isEqualTo("Test_Area")
        assertThat(savedRegulatoryArea.facade).isEqualTo("NAMO")
        assertThat(savedRegulatoryArea.refReg).isEqualTo("Arrêté test pour création")
        assertThat(savedRegulatoryArea.resume).isEqualTo("Zone de test")
        assertThat(savedRegulatoryArea.geom).isNotNull()
        assertThat(savedRegulatoryArea.tags).hasSize(1)
        assertThat(savedRegulatoryArea.tags[0].id).isEqualTo(5)
        assertThat(savedRegulatoryArea.tags[0].name).isEqualTo("Mouillage")
        assertThat(savedRegulatoryArea.themes).hasSize(1)
        assertThat(savedRegulatoryArea.themes[0].id).isEqualTo(9)
        assertThat(savedRegulatoryArea.themes[0].name).isEqualTo("Pêche à pied")
    }

    @Test
    @Transactional
    fun `save should update regulatory area`() {
        val existingRegulatoryArea = jpaRegulatoryAreaNewRepository.findById(300)
        println("Existing regulatory area before update: $existingRegulatoryArea")
        require(existingRegulatoryArea != null)

        val updatedRegulatoryArea =
            existingRegulatoryArea.copy(
                layerName = "Updated_RNN_Iroise",
                resume = "Mise à jour de la zone",
                tags = listOf(aTag(id = 5), aTag(id = 6)),
                themes = listOf(aTheme(id = 9)),
            )

        val savedRegulatoryArea = jpaRegulatoryAreaNewRepository.save(updatedRegulatoryArea)

        assertThat(savedRegulatoryArea.id).isEqualTo(300)
        assertThat(savedRegulatoryArea.layerName).isEqualTo("Updated_RNN_Iroise")
        assertThat(savedRegulatoryArea.resume).isEqualTo("Mise à jour de la zone")
        assertThat(savedRegulatoryArea.tags).hasSize(2)
        assertThat(savedRegulatoryArea.tags.map { it.id }).containsExactlyInAnyOrder(5, 6)
        assertThat(savedRegulatoryArea.themes).hasSize(1)
        assertThat(savedRegulatoryArea.themes[0].id).isEqualTo(9)
    }
}
