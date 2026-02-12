package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.CreateOrUpdateRegulatoryArea
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllLayerNames
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllNewRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreasToCreate
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetNewRegulatoryAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(SpringExtension::class)
@WebMvcTest(value = [(RegulatoryAreasNew::class)])
class RegulatoryAreasNewITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getAllRegulatoryAreas: GetAllNewRegulatoryAreas

    @MockitoBean
    private lateinit var getRegulatoryAreaById: GetNewRegulatoryAreaById

    @MockitoBean
    private lateinit var getAllLayerNames: GetAllLayerNames

    @MockitoBean
    private lateinit var createOrUpdateRegulatoryArea: CreateOrUpdateRegulatoryArea

    @MockitoBean
    private lateinit var getAllRegulatoryAreasToCreate: GetAllRegulatoryAreasToCreate

    private val wktReader = WKTReader()

    private val multipolygonString =
        "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
    private val polygon = wktReader.read(multipolygonString) as MultiPolygon

    private val url =
        "https://extranet.legicem.metier.developpement-durable.gouv.fr/zmel-roscanvel-a3474.html?id_rub=1098"

    private val refReg =
        "Arrêté inter-préfectoral N°2020118-0003 autorisant l'occupation temporaire du domaine public maritime par une zone de mouillages et d'équipements légers au lit-dit \"Cale de Quérlen\" sur le littoral de la commune de Roscanvel"

    @Test
    fun `Should get all regulatory Areas`() {
        // Given
        val regulatoryArea =
            RegulatoryAreaNewEntity(
                id = 17,
                geom = polygon,
                url = url,
                creation = ZonedDateTime.parse("2021-11-01T04:50:09Z"),
                layerName = "ZMEL_Cale_Querlen",
                facade = "NAMO",
                refReg = refReg,
                editionBo = ZonedDateTime.parse("2021-11-02T04:50:09Z"),
                editionCacem = null,
                editeur = "Alexis Pré",
                source = "",
                observation = "",
                tags = listOf(aTag(name = "Mouillage")),
                themes = listOf(aTheme(name = "AMP")),
                date = ZonedDateTime.parse("2020-07-01T04:50:09Z"),
                dureeValidite = "15 ans",
                dateFin = ZonedDateTime.parse("2035-07-01T04:50:09Z"),
                temporalite = "temporaire",
                plan = "PIRC",
                polyName = "Zone au sud de la cale",
                resume = "Descriptif de la zone réglementaire",
            )
        given(
            getAllRegulatoryAreas.execute(
                groupBy = null,
                searchQuery = null,
                seaFronts = null,
            ),
        ).willReturn(mapOf("PIRC" to listOf(regulatoryArea)))

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].group", equalTo("PIRC")))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].id", equalTo(regulatoryArea.id)))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].layerName", equalTo(regulatoryArea.layerName)))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].refReg", equalTo(regulatoryArea.refReg)))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].tags[0].name", equalTo("Mouillage")))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].type", equalTo(regulatoryArea.type)))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].themes[0].name", equalTo("AMP")))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].plan", equalTo("PIRC")))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].polyName", equalTo("Zone au sud de la cale")))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].resume", equalTo("Descriptif de la zone réglementaire")))
    }

    @Test
    fun `Should get regulatory area by id`() {
        // Given
        val regulatoryArea =
            RegulatoryAreaNewEntity(
                id = 17,
                geom = polygon,
                url = url,
                creation = ZonedDateTime.parse("2021-11-01T04:50:09Z"),
                layerName = "ZMEL_Cale_Querlen",
                facade = "NAMO",
                refReg = refReg,
                editionBo = ZonedDateTime.parse("2021-11-02T04:50:09Z"),
                editionCacem = null,
                editeur = "Alexis Pré",
                source = "",
                observation = "",
                tags = listOf(aTag(name = "Mouillage")),
                themes = listOf(aTheme(name = "AMP")),
                date = ZonedDateTime.parse("2020-07-01T04:50:09Z"),
                dureeValidite = "15 ans",
                dateFin = ZonedDateTime.parse("2035-07-01T04:50:09Z"),
                temporalite = "temporaire",
                plan = "PIRC",
                polyName = "Zone au sud de la cale",
                resume = "Descriptif de la zone réglementaire",
            )
        given(getRegulatoryAreaById.execute(17)).willReturn(regulatoryArea)

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas/17"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(regulatoryArea.id)))
            .andExpect(jsonPath("$.layerName", equalTo(regulatoryArea.layerName)))
            .andExpect(jsonPath("$.refReg", equalTo(regulatoryArea.refReg)))
            .andExpect(jsonPath("$.tags[0].name", equalTo("Mouillage")))
            .andExpect(jsonPath("$.themes[0].name", equalTo("AMP")))
            .andExpect(jsonPath("$.plan", equalTo("PIRC")))
    }

    @Test
    fun `Should return not found when regulatory area does not exist`() {
        // Given
        given(getRegulatoryAreaById.execute(999)).willReturn(null)

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas/999"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$").doesNotExist())
    }

    @Test
    fun `Should get all layer names`() {
        // Given
        val layerNames = listOf("ZMEL_Cale_Querlen", "AMP_Zone_1", "PIRC_Area_2")
        given(getAllLayerNames.execute()).willReturn(layerNames)

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas/layer-names"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.layerNames[0]", equalTo("ZMEL_Cale_Querlen")))
            .andExpect(jsonPath("$.layerNames[1]", equalTo("AMP_Zone_1")))
            .andExpect(jsonPath("$.layerNames[2]", equalTo("PIRC_Area_2")))
    }

    @Test
    fun `Should get empty list when no layer names exist`() {
        // Given
        given(getAllLayerNames.execute()).willReturn(emptyList())

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas/layer-names"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.layerNames").isEmpty)
    }

    @Test
    fun `Should get all regulatory areas to create`() {
        // Given
        val regulatoryArea =
            RegulatoryAreaNewEntity(
                id = 17,
                geom = polygon,
                url = url,
                creation = null,
                layerName = null,
                facade = null,
                refReg = null,
                editionBo = null,
                editionCacem = null,
                editeur = null,
                source = null,
                observation = null,
                tags = listOf(),
                themes = listOf(),
                date = null,
                dureeValidite = null,
                dateFin = null,
                temporalite = null,
                plan = null,
                polyName = null,
                resume = null,
            )
        given(getAllRegulatoryAreasToCreate.execute()).willReturn(listOf(regulatoryArea))

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas/to-create"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(regulatoryArea.id)))
    }

    @Test
    fun `Should filter regulatory areas by seaFronts`() {
        // Given
        val regulatoryArea =
            RegulatoryAreaNewEntity(
                id = 17,
                geom = polygon,
                url = url,
                creation = ZonedDateTime.parse("2021-11-01T04:50:09Z"),
                layerName = "ZMEL_Cale_Querlen",
                facade = "NAMO",
                refReg = refReg,
                editionBo = ZonedDateTime.parse("2021-11-02T04:50:09Z"),
                editionCacem = null,
                editeur = "Alexis Pré",
                source = "",
                observation = "",
                tags = listOf(aTag(name = "Mouillage")),
                themes = listOf(aTheme(name = "AMP")),
                date = ZonedDateTime.parse("2020-07-01T04:50:09Z"),
                dureeValidite = "15 ans",
                dateFin = ZonedDateTime.parse("2035-07-01T04:50:09Z"),
                temporalite = "temporaire",
                plan = "PIRC",
                polyName = "Zone au sud de la cale",
                resume = "Descriptif de la zone réglementaire",
            )
        given(
            getAllRegulatoryAreas.execute(
                groupBy = null,
                searchQuery = null,
                seaFronts = listOf("NAMO"),
            ),
        ).willReturn(mapOf("PIRC" to listOf(regulatoryArea)))

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas?seaFronts=NAMO"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].group", equalTo("PIRC")))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].facade", equalTo("NAMO")))
    }

    @Test
    fun `Should filter regulatory areas by searchQuery`() {
        // Given
        val regulatoryArea =
            RegulatoryAreaNewEntity(
                id = 17,
                geom = polygon,
                url = url,
                creation = ZonedDateTime.parse("2021-11-01T04:50:09Z"),
                layerName = "ZMEL_Cale_Querlen",
                facade = "NAMO",
                refReg = refReg,
                editionBo = ZonedDateTime.parse("2021-11-02T04:50:09Z"),
                editionCacem = null,
                editeur = "Alexis Pré",
                source = "",
                observation = "",
                tags = listOf(aTag(name = "Mouillage")),
                themes = listOf(aTheme(name = "AMP")),
                date = ZonedDateTime.parse("2020-07-01T04:50:09Z"),
                dureeValidite = "15 ans",
                dateFin = ZonedDateTime.parse("2035-07-01T04:50:09Z"),
                temporalite = "temporaire",
                plan = "PIRC",
                polyName = "Zone au sud de la cale",
                resume = "Descriptif de la zone réglementaire",
            )
        given(
            getAllRegulatoryAreas.execute(
                groupBy = null,
                searchQuery = "Querlen",
                seaFronts = null,
            ),
        ).willReturn(mapOf("PIRC" to listOf(regulatoryArea)))

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas?searchQuery=Querlen"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].regulatoryAreas[0].layerName", equalTo("ZMEL_Cale_Querlen")))
    }

    @Test
    fun `Should return empty result when no regulatory areas match filters`() {
        // Given
        given(
            getAllRegulatoryAreas.execute(
                groupBy = null,
                searchQuery = "NonExistent",
                seaFronts = null,
            ),
        ).willReturn(emptyMap())

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas?searchQuery=NonExistent"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$").isEmpty)
    }

    @Test
    fun `Should group regulatory areas by specified groupBy parameter`() {
        // Given
        val regulatoryArea1 =
            RegulatoryAreaNewEntity(
                id = 17,
                geom = polygon,
                url = url,
                creation = ZonedDateTime.parse("2021-11-01T04:50:09Z"),
                layerName = "Layer1",
                facade = "NAMO",
                refReg = refReg,
                editionBo = ZonedDateTime.parse("2021-11-02T04:50:09Z"),
                editionCacem = null,
                editeur = "Alexis Pré",
                source = "",
                observation = "",
                tags = listOf(aTag(name = "Mouillage")),
                themes = listOf(aTheme(name = "AMP")),
                date = ZonedDateTime.parse("2020-07-01T04:50:09Z"),
                dureeValidite = "15 ans",
                dateFin = ZonedDateTime.parse("2035-07-01T04:50:09Z"),
                temporalite = "temporaire",
                plan = "PIRC",
                polyName = "Zone 1",
                resume = "Description 1",
            )
        val regulatoryArea2 =
            RegulatoryAreaNewEntity(
                id = 18,
                geom = polygon,
                url = url,
                creation = ZonedDateTime.parse("2021-11-01T04:50:09Z"),
                layerName = "Layer2",
                facade = "NAMO",
                refReg = refReg,
                editionBo = ZonedDateTime.parse("2021-11-02T04:50:09Z"),
                editionCacem = null,
                editeur = "Jean Dupont",
                source = "",
                observation = "",
                tags = listOf(aTag(name = "Navigation")),
                themes = listOf(aTheme(name = "PIRC")),
                date = ZonedDateTime.parse("2020-08-01T04:50:09Z"),
                dureeValidite = "10 ans",
                dateFin = ZonedDateTime.parse("2030-08-01T04:50:09Z"),
                temporalite = "permanente",
                plan = "PSCEM",
                polyName = "Zone 2",
                resume = "Description 2",
            )
        given(
            getAllRegulatoryAreas.execute(
                groupBy = "CONTROL_PLAN",
                searchQuery = null,
                seaFronts = null,
            ),
        ).willReturn(mapOf("PIRC" to listOf(regulatoryArea1), "PSCEM" to listOf(regulatoryArea2)))

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas?groupBy=CONTROL_PLAN"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].group", equalTo("PIRC")))
            .andExpect(jsonPath("$[1].group", equalTo("PSCEM")))
    }
}
