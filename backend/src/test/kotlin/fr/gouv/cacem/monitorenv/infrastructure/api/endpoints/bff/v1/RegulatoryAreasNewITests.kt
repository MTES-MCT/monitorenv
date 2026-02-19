package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.argThat
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.CreateOrUpdateRegulatoryArea
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllLayerNames
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllNewRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreasToComplete
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetNewRegulatoryAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea.RegulatoryAreaDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags.TagInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.themes.ThemeInput
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
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
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
    private lateinit var getAllRegulatoryAreasToComplete: GetAllRegulatoryAreasToComplete

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    private val wktReader = WKTReader()

    private val multipolygonString =
        "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
    private val polygon = wktReader.read(multipolygonString) as MultiPolygon

    private val url =
        "https://extranet.legicem.metier.developpement-durable.gouv.fr/zmel-roscanvel-a3474.html?id_rub=1098"

    private val refReg =
        "Arrêté inter-préfectoral N°2020118-0003 autorisant l'occupation temporaire du domaine public maritime par une zone de mouillages et d'équipements légers au lit-dit \"Cale de Quérlen\" sur le littoral de la commune de Roscanvel"

    private val regulatoryArea =
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
            tags = listOf(aTag(name = "Mouillage", id = 5)),
            themes = listOf(aTheme(name = "Zone de mouillage et d'équipement léger (ZMEL)", id = 101)),
            date = ZonedDateTime.parse("2020-07-01T04:50:09Z"),
            dureeValidite = "15 ans",
            dateFin = ZonedDateTime.parse("2035-07-01T04:50:09Z"),
            temporalite = "temporaire",
            plan = "PIRC",
            polyName = "Zone au sud de la cale",
            resume = "Descriptif de la zone réglementaire",
        )

    @Test
    fun `Should get all regulatory Areas`() {
        // Given
        given(
            getAllRegulatoryAreas.execute(
                searchQuery = null,
                seaFronts = null,
                tags = null,
                themes = null,
            ),
        ).willReturn(mapOf("ZMEL_Cale_Querlen" to listOf(regulatoryArea)))

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].group", equalTo("ZMEL_Cale_Querlen")))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].id", equalTo(regulatoryArea.id)))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].layerName", equalTo(regulatoryArea.layerName)))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].refReg", equalTo(regulatoryArea.refReg)))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].tags[0].name", equalTo("Mouillage")))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].type", equalTo(regulatoryArea.type)))
            .andExpect(
                jsonPath(
                    "$[0].regulatoryAreas[0].themes[0].name",
                    equalTo("Zone de mouillage et d'équipement léger (ZMEL)"),
                ),
            ).andExpect(jsonPath("$[0].regulatoryAreas[0].plan", equalTo("PIRC")))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].polyName", equalTo("Zone au sud de la cale")))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].resume", equalTo("Descriptif de la zone réglementaire")))
    }

    @Test
    fun `Should get regulatory area by id`() {
        // Given
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
            .andExpect(jsonPath("$.themes[0].name", equalTo("Zone de mouillage et d'équipement léger (ZMEL)")))
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
        val layerNames = mapOf("ZMEL_Cale_Querlen" to 1L, "AMP_Zone_1" to 1L, "PIRC_Area_2" to 1L)
        given(getAllLayerNames.execute()).willReturn(layerNames)

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas/layer-names"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.layerNames.ZMEL_Cale_Querlen").value(1))
            .andExpect(jsonPath("$.layerNames.AMP_Zone_1").value(1))
            .andExpect(jsonPath("$.layerNames.PIRC_Area_2").value(1))
    }

    @Test
    fun `Should get empty list when no layer names exist`() {
        // Given
        given(getAllLayerNames.execute()).willReturn(mapOf())

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
        given(getAllRegulatoryAreasToComplete.execute()).willReturn(listOf(regulatoryArea))

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas/to-complete"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(regulatoryArea.id)))
    }

    @Test
    fun `Should filter regulatory areas by seaFronts`() {
        // Given
        given(
            getAllRegulatoryAreas.execute(
                searchQuery = null,
                seaFronts = listOf("NAMO"),
                tags = null,
                themes = null,
            ),
        ).willReturn(mapOf("ZMEL_Cale_Querlen" to listOf(regulatoryArea)))

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas?seaFronts=NAMO"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].group", equalTo("ZMEL_Cale_Querlen")))
            .andExpect(jsonPath("$[0].regulatoryAreas[0].facade", equalTo("NAMO")))
    }

    @Test
    fun `Should filter regulatory areas by searchQuery`() {
        // Given
        given(
            getAllRegulatoryAreas.execute(
                searchQuery = "Querlen",
                seaFronts = null,
                tags = null,
                themes = null,
            ),
        ).willReturn(mapOf("ZMEL_Cale_Querlen" to listOf(regulatoryArea)))

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
                searchQuery = "NonExistent",
                seaFronts = null,
                tags = null,
                themes = null,
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
    fun `Should filter regulatory areas by tags`() {
        // Given
        given(
            getAllRegulatoryAreas.execute(
                searchQuery = null,
                seaFronts = null,
                tags = listOf(5),
                themes = null,
            ),
        ).willReturn(mapOf("ZMEL_Cale_Querlen" to listOf(regulatoryArea)))

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas?tags=5"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].regulatoryAreas[0].tags[0].name", equalTo("Mouillage")))
    }

    @Test
    fun `Should filter regulatory areas by themes`() {
        // Given
        given(
            getAllRegulatoryAreas.execute(
                searchQuery = null,
                seaFronts = null,
                tags = null,
                themes = listOf(101),
            ),
        ).willReturn(mapOf("ZMEL_Cale_Querlen" to listOf(regulatoryArea)))

        // When
        mockMvc
            .perform(get("/bff/regulatory-areas?themes=101"))
            // Then
            .andExpect(status().isOk)
            .andExpect(
                jsonPath(
                    "$[0].regulatoryAreas[0].themes[0].name",
                    equalTo("Zone de mouillage et d'équipement léger (ZMEL)"),
                ),
            )
    }

    @Test
    fun `Should create new regulatory area`() {
        // Given
        val regulatoryAreaToComplete =
            RegulatoryAreaNewEntity(
                id = 9999,
                geom = polygon,
                url = url,
                creation = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                layerName = "New_Layer",
                facade = "MED",
                refReg = "New regulation reference",
                editionBo = ZonedDateTime.parse("2024-01-02T00:00:00Z"),
                editionCacem = null,
                editeur = "Test Editor",
                source = "Test Source",
                observation = "Test observation",
                tags = listOf(aTag(id = 5, name = "Mouillage")),
                themes = listOf(aTheme(id = 9, name = "AMP")),
                date = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                dureeValidite = "10 ans",
                dateFin = ZonedDateTime.parse("2034-01-01T00:00:00Z"),
                temporalite = "permanent",
                plan = "PIRC",
                polyName = "New Zone",
                resume = "New zone description",
                type = "ZPM",
                authorizationPeriods = null,
                prohibitionPeriods = null,
                othersRefReg = null,
            )

        val requestBody =
            RegulatoryAreaDataInput(
                id = 9999,
                layerName = "New_Layer",
                facade = "MED",
                refReg = "New regulation reference",
                resume = "New zone description",
                plan = "PIRC",
                polyName = "New Zone",
                type = "ZPM",
                editeur = "Test Editor",
                source = "Test Source",
                observation = "Test observation",
                date = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                dateFin = ZonedDateTime.parse("2034-01-01T00:00:00Z"),
                dureeValidite = "10 ans",
                temporalite = "permanent",
                editionBo = ZonedDateTime.parse("2024-01-02T00:00:00Z"),
                creation = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                url = url,
                tags =
                    listOf(
                        TagInput(
                            id = 5,
                            name = "Mouillage",
                            subTags = listOf(),
                            startedAt = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                            endedAt = null,
                        ),
                    ),
                themes =
                    listOf(
                        ThemeInput(
                            id = 9,
                            name = "AMP",
                            subThemes = listOf(),
                            startedAt = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                            endedAt = null,
                        ),
                    ),
            )

        given(
            createOrUpdateRegulatoryArea.execute(
                regulatoryArea = requestBody.toRegulatoryAreaEntity(),
            ),
        ).willReturn(regulatoryAreaToComplete)

        // When
        mockMvc
            .perform(
                put("/bff/regulatory-areas")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody)),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(9999)))
            .andExpect(jsonPath("$.layerName", equalTo("New_Layer")))
            .andExpect(jsonPath("$.facade", equalTo("MED")))
            .andExpect(jsonPath("$.refReg", equalTo("New regulation reference")))
            .andExpect(jsonPath("$.resume", equalTo("New zone description")))
            .andExpect(jsonPath("$.plan", equalTo("PIRC")))
            .andExpect(jsonPath("$.polyName", equalTo("New Zone")))
            .andExpect(jsonPath("$.type", equalTo("ZPM")))
            .andExpect(jsonPath("$.tags[0].name", equalTo("Mouillage")))
            .andExpect(jsonPath("$.themes[0].name", equalTo("AMP")))
    }

    @Test
    fun `Should update existing regulatory area`() {
        // Given
        val updatedRegulatoryArea =
            RegulatoryAreaNewEntity(
                id = 17,
                geom = polygon,
                url = url,
                creation = ZonedDateTime.parse("2021-11-01T04:50:09Z"),
                layerName = "ZMEL_Cale_Querlen_Updated",
                facade = "NAMO",
                refReg = refReg,
                editionBo = ZonedDateTime.parse("2024-03-01T00:00:00Z"),
                editionCacem = ZonedDateTime.parse("2024-03-02T00:00:00Z"),
                editeur = "Updated Editor",
                source = "Updated Source",
                observation = "Updated observation",
                tags = listOf(aTag(id = 5, name = "Mouillage"), aTag(id = 6, name = "Extraction granulats")),
                themes = listOf(aTheme(id = 9, name = "AMP")),
                date = ZonedDateTime.parse("2020-07-01T04:50:09Z"),
                dureeValidite = "20 ans",
                dateFin = ZonedDateTime.parse("2040-07-01T04:50:09Z"),
                temporalite = "permanent",
                plan = "PIRC",
                polyName = "Zone mise à jour",
                resume = "Description mise à jour",
                type = "AMP",
                authorizationPeriods = null,
                prohibitionPeriods = null,
                othersRefReg = null,
            )

        val requestBody =
            RegulatoryAreaDataInput(
                id = 17,
                geom = polygon,
                url = url,
                creation = ZonedDateTime.parse("2021-11-01T04:50:09Z"),
                layerName = "ZMEL_Cale_Querlen_Updated",
                facade = "NAMO",
                refReg = refReg,
                editionBo = ZonedDateTime.parse("2024-03-01T00:00:00Z"),
                editionCacem = ZonedDateTime.parse("2024-03-02T00:00:00Z"),
                editeur = "Updated Editor",
                source = "Updated Source",
                observation = "Updated observation",
                tags =
                    listOf(
                        TagInput(
                            id = 5,
                            name = "Mouillage",
                            subTags = listOf(),
                            startedAt = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                            endedAt = null,
                        ),
                        TagInput(
                            id = 6,
                            name = "Extraction granulats",
                            subTags = listOf(),
                            startedAt = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                            endedAt = null,
                        ),
                    ),
                themes =
                    listOf(
                        ThemeInput(
                            id = 9,
                            name = "AMP",
                            subThemes = listOf(),
                            startedAt = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                            endedAt = null,
                        ),
                    ),
                date = ZonedDateTime.parse("2020-07-01T04:50:09Z"),
                dureeValidite = "20 ans",
                dateFin = ZonedDateTime.parse("2040-07-01T04:50:09Z"),
                temporalite = "permanent",
                plan = "PIRC",
                polyName = "Zone mise à jour",
                resume = "Description mise à jour",
                type = "AMP",
                authorizationPeriods = null,
                prohibitionPeriods = null,
                othersRefReg = null,
            )

        given(
            createOrUpdateRegulatoryArea.execute(
                argThat {
                    id == 17
                },
            ),
        ).willReturn(updatedRegulatoryArea)

        // When
        mockMvc
            .perform(
                put("/bff/regulatory-areas")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody)),
            ).andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(17)))
            .andExpect(jsonPath("$.layerName", equalTo("ZMEL_Cale_Querlen_Updated")))
            .andExpect(jsonPath("$.facade", equalTo("NAMO")))
            .andExpect(jsonPath("$.resume", equalTo("Description mise à jour")))
            .andExpect(jsonPath("$.polyName", equalTo("Zone mise à jour")))
            .andExpect(jsonPath("$.type", equalTo("AMP")))
            .andExpect(jsonPath("$.tags.length()", equalTo(2)))
            .andExpect(jsonPath("$.themes.length()", equalTo(1)))
    }
}
