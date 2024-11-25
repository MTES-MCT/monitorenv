package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreaById
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(SpringExtension::class)
@WebMvcTest(value = [(RegulatoryAreas::class)])
class RegulatoryAreasITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getAllRegulatoryAreas: GetAllRegulatoryAreas

    @MockBean
    private lateinit var getRegulatoryAreaById: GetRegulatoryAreaById

    val WKTreader = WKTReader()

    val multipolygonString =
        "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
    val Polygon = WKTreader.read(multipolygonString) as MultiPolygon

    val url =
        "http://extranet.legicem.metier.developpement-durable.gouv.fr/zmel-roscanvel-a3474.html?id_rub=1098"

    val refReg =
        "Arrêté inter-préfectoral N°2020118-0003 autorisant l'occupation temporaire du domaine public maritime par une zone de mouillages et d'équipements légers au lit-dit \"Cale de Quérlen\" sur le littoral de la commune de Roscanvel"

    val WKTreader = WKTReader()

    val multipolygonString =
        "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
    val Polygon = WKTreader.read(multipolygonString) as MultiPolygon

    val url =
        "http://extranet.legicem.metier.developpement-durable.gouv.fr/zmel-roscanvel-a3474.html?id_rub=1098"

    val refReg =
        "Arrêté inter-préfectoral N°2020118-0003 autorisant l'occupation temporaire du domaine public maritime par une zone de mouillages et d'équipements légers au lit-dit \"Cale de Quérlen\" sur le littoral de la commune de Roscanvel"

    @Test
    fun `Should get all regulatory Areas`() {
        // Given
        val regulatoryArea =
            RegulatoryAreaEntity(
                id = 17,
                geom = Polygon,
                entity_name = "Zone au sud de la cale",
                url = url,
                layer_name = "ZMEL_Cale_Querlen",
                facade = "NAMO",
                ref_reg = refReg,
                edition = "2021-11-02",
                editeur = "Alexis Pré",
                source = "",
                observation = "",
                thematique = "Mouillage",
                date = "2020-07-01",
                duree_validite = "15 ans",
                date_fin = "2035-07-01",
                temporalite = "temporaire",
            )
        given(getAllRegulatoryAreas.execute()).willReturn(listOf(regulatoryArea))

        // When
        mockMvc.perform(get("/bff/v1/regulatory"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(regulatoryArea.id)))
            .andExpect(jsonPath("$[0].entity_name", equalTo(regulatoryArea.entity_name)))
            .andExpect(jsonPath("$[0].layer_name", equalTo(regulatoryArea.layer_name)))
            .andExpect(jsonPath("$[0].ref_reg", equalTo(regulatoryArea.ref_reg)))
            .andExpect(jsonPath("$[0].thematique", equalTo(regulatoryArea.thematique)))
            .andExpect(jsonPath("$[0].type", equalTo(regulatoryArea.type)))
            .andExpect(jsonPath("$[0].geom.type", equalTo("MultiPolygon")))
    }

    @Test
    fun `Should get specific regulatory Area when requested by Id`() {
        // Given
        val regulatoryArea =
            RegulatoryAreaEntity(
                id = 17,
                geom = Polygon,
                entity_name = "Zone au sud de la cale",
                url = url,
                layer_name = "ZMEL_Cale_Querlen",
                facade = "NAMO",
                ref_reg = refReg,
                edition = "2021-11-02",
                editeur = "Alexis Pré",
                source = "",
                observation = "",
                thematique = "Mouillage",
                date = "2020-07-01",
                duree_validite = "15 ans",
                date_fin = "2035-07-01",
                temporalite = "temporaire",
            )

        given(getRegulatoryAreaById.execute(17)).willReturn(regulatoryArea)

        // When
        mockMvc.perform(get("/bff/v1/regulatory/17"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(regulatoryArea.id)))
            .andExpect(jsonPath("$.entity_name", equalTo(regulatoryArea.entity_name)))
            .andExpect(jsonPath("$.facade", equalTo(regulatoryArea.facade)))
            .andExpect(jsonPath("$.geom.type", equalTo("MultiPolygon")))
            .andExpect(jsonPath("$.layer_name", equalTo(regulatoryArea.layer_name)))
            .andExpect(jsonPath("$.ref_reg", equalTo(regulatoryArea.ref_reg)))
            .andExpect(jsonPath("$.thematique", equalTo(regulatoryArea.thematique)))
            .andExpect(jsonPath("$.type", equalTo(regulatoryArea.type)))
            .andExpect(jsonPath("$.url", equalTo(regulatoryArea.url)))
    }
}
