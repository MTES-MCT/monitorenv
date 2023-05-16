package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreas
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(WebSecurityConfig::class)
@WebMvcTest(value = [(RegulatoryAreasController::class)])
class RegulatoryAreasControllerITests {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getRegulatoryAreas: GetRegulatoryAreas

    @MockBean
    private lateinit var getRegulatoryAreaById: GetRegulatoryAreaById

    @Test
    fun `Should get all regulatory Areas`() {
        // Given
        val WKTreader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
        val Polygon = WKTreader.read(multipolygonString) as MultiPolygon
        val regulatoryArea = RegulatoryAreaEntity(
            id = 17,
            geom = Polygon,
            entity_name = "Zone au sud de la cale",
            url = "http://extranet.legicem.metier.developpement-durable.gouv.fr/zmel-roscanvel-a3474.html?id_rub=1098",
            layer_name = "ZMEL_Cale_Querlen",
            facade = "NAMO",
            ref_reg = "Arrêté inter-préfectoral N°2020118-0003 autorisant l'occupation temporaire du domaine public maritime par une zone de mouillages et d'équipements légers au lit-dit \"Cale de Quérlen\" sur le littoral de la commune de Roscanvel ",
            edition = "2021-11-02",
            editeur = "Alexis Pré",
            source = "",
            observation = "",
            thematique = "Mouillage",
            echelle = "1:1000",
            date = "2020-07-01",
            duree_validite = "15 ans",
            date_fin = "2035-07-01",
            temporalite = "temporaire",
            objet = "",
            signataire = "",
        )
        given(this.getRegulatoryAreas.execute()).willReturn(listOf(regulatoryArea))

        // When
        mockMvc.perform(get("/bff/v1/regulatory"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(regulatoryArea.id)))
            .andExpect(jsonPath("$[0].entity_name", equalTo(regulatoryArea.entity_name)))
            .andExpect(jsonPath("$[0].layer_name", equalTo(regulatoryArea.layer_name)))
            .andExpect(jsonPath("$[0].facade", equalTo(regulatoryArea.facade)))
            .andExpect(jsonPath("$[0].ref_reg", equalTo(regulatoryArea.ref_reg)))
            .andExpect(jsonPath("$[0].thematique", equalTo(regulatoryArea.thematique)))
            .andExpect(jsonPath("$[0].echelle", equalTo(regulatoryArea.echelle)))
            .andExpect(jsonPath("$[0].date", equalTo(regulatoryArea.date)))
            .andExpect(jsonPath("$[0].duree_validite", equalTo(regulatoryArea.duree_validite)))
    }

    @Test
    fun `Should get specific regulatory Area when requested by Id`() {
        // Given
        val WKTreader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
        val Polygon = WKTreader.read(multipolygonString) as MultiPolygon
        val regulatoryArea = RegulatoryAreaEntity(
            id = 17,
            geom = Polygon,
            entity_name = "Zone au sud de la cale",
            url = "http://extranet.legicem.metier.developpement-durable.gouv.fr/zmel-roscanvel-a3474.html?id_rub=1098",
            layer_name = "ZMEL_Cale_Querlen",
            facade = "NAMO",
            ref_reg = "Arrêté inter-préfectoral N°2020118-0003 autorisant l'occupation temporaire du domaine public maritime par une zone de mouillages et d'équipements légers au lit-dit \"Cale de Quérlen\" sur le littoral de la commune de Roscanvel ",
            edition = "2021-11-02",
            editeur = "Alexis Pré",
            source = "",
            observation = "",
            thematique = "Mouillage",
            echelle = "1:1000",
            date = "2020-07-01",
            duree_validite = "15 ans",
            date_fin = "2035-07-01",
            temporalite = "temporaire",
            objet = "",
            signataire = "",
        )

        given(this.getRegulatoryAreaById.execute(17)).willReturn(regulatoryArea)

        // When
        mockMvc.perform(get("/bff/v1/regulatory/17"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(regulatoryArea.id)))
            .andExpect(jsonPath("$.entity_name", equalTo(regulatoryArea.entity_name)))
            .andExpect(jsonPath("$.url", equalTo(regulatoryArea.url)))
            .andExpect(jsonPath("$.facade", equalTo(regulatoryArea.facade)))
            .andExpect(jsonPath("$.thematique", equalTo(regulatoryArea.thematique)))
            .andExpect(jsonPath("$.layer_name", equalTo(regulatoryArea.layer_name)))
            .andExpect(jsonPath("$.ref_reg", equalTo(regulatoryArea.ref_reg)))
            .andExpect(jsonPath("$.date", equalTo(regulatoryArea.date)))
            .andExpect(jsonPath("$.temporalite", equalTo(regulatoryArea.temporalite)))
    }
}
