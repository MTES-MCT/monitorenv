package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.nhaarman.mockitokotlin2.argThat
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.CreateOrUpdateRegulatoryArea
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.CreateOrUpdateRegulatoryAreaGroup
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllLayerNames
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreasToComplete
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreaByIds
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreasGroupById
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture.Companion.aRegulatoryArea
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea.RegulatoryAreaByIdsDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea.RegulatoryAreaDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags.TagInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.themes.ThemeInput
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import tools.jackson.databind.json.JsonMapper
import java.time.ZonedDateTime

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(SpringExtension::class)
@WebMvcTest(value = [(RegulatoryAreas::class)])
class RegulatoryAreasITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getAllRegulatoryAreas: GetAllRegulatoryAreas

    @MockitoBean
    private lateinit var getRegulatoryAreaById: GetRegulatoryAreaById

    @MockitoBean
    private lateinit var getAllLayerNames: GetAllLayerNames

    @MockitoBean
    private lateinit var createOrUpdateRegulatoryArea: CreateOrUpdateRegulatoryArea

    @MockitoBean
    private lateinit var getAllRegulatoryAreasToComplete: GetAllRegulatoryAreasToComplete

    @MockitoBean
    private lateinit var getRegulatoryAreaByIds: GetRegulatoryAreaByIds

    @MockitoBean
    private lateinit var getRegulatoryAreasGroupById: GetRegulatoryAreasGroupById

    @MockitoBean
    private lateinit var createOrUpdateRegulatoryAreaGroup: CreateOrUpdateRegulatoryAreaGroup

    @Autowired
    private lateinit var mapper: JsonMapper

    private val wktReader = WKTReader()

    private val multipolygonString =
        "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
    private val polygon = wktReader.read(multipolygonString) as MultiPolygon

    private val url =
        "https://extranet.legicem.metier.developpement-durable.gouv.fr/zmel-roscanvel-a3474.html?id_rub=1098"

    private val refReg =
        "Arrêté inter-préfectoral N°2020118-0003 autorisant l'occupation temporaire du domaine public maritime par une zone de mouillages et d'équipements légers au lit-dit \"Cale de Quérlen\" sur le littoral de la commune de Roscanvel"

    private val regulatoryArea =
        RegulatoryAreaEntity(
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
            tags = listOf(TagFixture.aTag(name = "Mouillage", id = 5)),
            themes =
                listOf(
                    ThemeFixture.aTheme(
                        name = "Zone de mouillage et d'équipement léger (ZMEL)",
                        id = 101,
                    ),
                ),
            date = ZonedDateTime.parse("2020-07-01T04:50:09Z"),
            dateFin = ZonedDateTime.parse("2035-07-01T04:50:09Z"),
            plan = "PIRC",
            polyName = "Zone au sud de la cale",
            place = null,
            resume = "Descriptif de la zone réglementaire",
            areaType = AreaTypeEnum.ZONE,
        )

    @Test
    fun `Should get all regulatory Areas`() {
        // Given
        val regulatoryAreaGroup = aRegulatoryArea(layerName = "ZMEL_Cale_Querlen")

        BDDMockito
            .given(
                getAllRegulatoryAreas.execute(
                    controlPlan = null,
                    searchQuery = null,
                    seaFronts = null,
                    tags = null,
                    themes = null,
                ),
            ).willReturn(Pair(mapOf(regulatoryAreaGroup to listOf(regulatoryArea)), 1L))

        // When
        mockMvc
            .perform(MockMvcRequestBuilders.get("/bff/v1/regulatory-areas"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer.[0].group.layerName",
                    Matchers.equalTo("ZMEL_Cale_Querlen"),
                ),
            ).andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].id",
                    Matchers.equalTo(regulatoryArea.id),
                ),
            ).andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].layerName",
                    Matchers.equalTo(regulatoryArea.layerName),
                ),
            ).andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].refReg",
                    Matchers.equalTo(regulatoryArea.refReg),
                ),
            ).andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].tags[0].name",
                    Matchers.equalTo("Mouillage"),
                ),
            ).andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].type",
                    Matchers.equalTo(regulatoryArea.type),
                ),
            ).andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].themes[0].name",
                    Matchers.equalTo("Zone de mouillage et d'équipement léger (ZMEL)"),
                ),
            ).andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].plan",
                    Matchers.equalTo("PIRC"),
                ),
            ).andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].polyName",
                    Matchers.equalTo("Zone au sud de la cale"),
                ),
            ).andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].resume",
                    Matchers.equalTo("Descriptif de la zone réglementaire"),
                ),
            )
    }

    @Test
    fun `Should get regulatory area by id`() {
        // Given
        BDDMockito.given(getRegulatoryAreaById.execute(17)).willReturn(regulatoryArea)

        // When
        mockMvc
            .perform(MockMvcRequestBuilders.get("/bff/v1/regulatory-areas/17"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.equalTo(regulatoryArea.id)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.layerName", Matchers.equalTo(regulatoryArea.layerName)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.refReg", Matchers.equalTo(regulatoryArea.refReg)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.tags[0].name", Matchers.equalTo("Mouillage")))
            .andExpect(
                MockMvcResultMatchers.jsonPath(
                    "$.themes[0].name",
                    Matchers.equalTo("Zone de mouillage et d'équipement léger (ZMEL)"),
                ),
            ).andExpect(MockMvcResultMatchers.jsonPath("$.plan", Matchers.equalTo("PIRC")))
    }

    @Test
    fun `Should return not found when regulatory area does not exist`() {
        // Given
        BDDMockito.given(getRegulatoryAreaById.execute(999)).willReturn(null)

        // When
        mockMvc
            .perform(MockMvcRequestBuilders.get("/bff/v1/regulatory-areas/999"))
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$").doesNotExist())
    }

    @Test
    fun `Should get all layer names`() {
        // Given
        val layerNames = mapOf("ZMEL_Cale_Querlen" to 1L, "AMP_Zone_1" to 1L, "PIRC_Area_2" to 1L)
        BDDMockito.given(getAllLayerNames.execute()).willReturn(layerNames)

        // When
        mockMvc
            .perform(MockMvcRequestBuilders.get("/bff/v1/regulatory-areas/layer-names"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.layerNames.ZMEL_Cale_Querlen").value(1))
            .andExpect(MockMvcResultMatchers.jsonPath("$.layerNames.AMP_Zone_1").value(1))
            .andExpect(MockMvcResultMatchers.jsonPath("$.layerNames.PIRC_Area_2").value(1))
    }

    @Test
    fun `Should get empty list when no layer names exist`() {
        // Given
        BDDMockito.given(getAllLayerNames.execute()).willReturn(mapOf())

        // When
        mockMvc
            .perform(MockMvcRequestBuilders.get("/bff/v1/regulatory-areas/layer-names"))
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.layerNames").isEmpty)
    }

    @Test
    fun `Should get all regulatory areas to create`() {
        // Given
        val regulatoryArea =
            RegulatoryAreaEntity(
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
                dateFin = null,
                place = null,
                plan = null,
                polyName = null,
                areaType = AreaTypeEnum.ZONE,
                resume = null,
            )
        BDDMockito.given(getAllRegulatoryAreasToComplete.execute()).willReturn(listOf(regulatoryArea))

        // When
        mockMvc
            .perform(MockMvcRequestBuilders.get("/bff/v1/regulatory-areas/to-complete"))
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", Matchers.equalTo(regulatoryArea.id)))
    }

    @Test
    fun `Should filter regulatory areas by seaFronts`() {
        // Given
        val regulatoryAreaGroup = aRegulatoryArea(layerName = "ZMEL_Cale_Querlen")

        BDDMockito
            .given(
                getAllRegulatoryAreas.execute(
                    controlPlan = null,
                    searchQuery = null,
                    seaFronts = listOf("NAMO"),
                    tags = null,
                    themes = null,
                ),
            ).willReturn(Pair(mapOf(regulatoryAreaGroup to listOf(regulatoryArea)), 1L))

        // When
        mockMvc
            .perform(MockMvcRequestBuilders.get("/bff/v1/regulatory-areas?seaFronts=NAMO"))
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].group.layerName",
                    Matchers.equalTo("ZMEL_Cale_Querlen"),
                ),
            ).andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].facade",
                    Matchers.equalTo("NAMO"),
                ),
            )
    }

    @Test
    fun `Should filter regulatory areas by searchQuery`() {
        // Given
        val regulatoryAreaGroup = aRegulatoryArea(layerName = "ZMEL_Cale_Querlen")

        BDDMockito
            .given(
                getAllRegulatoryAreas.execute(
                    controlPlan = null,
                    searchQuery = "Querlen",
                    seaFronts = null,
                    tags = null,
                    themes = null,
                ),
            ).willReturn(Pair(mapOf(regulatoryAreaGroup to listOf(regulatoryArea)), 1L))

        // When
        mockMvc
            .perform(MockMvcRequestBuilders.get("/bff/v1/regulatory-areas?searchQuery=Querlen"))
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].layerName",
                    Matchers.equalTo("ZMEL_Cale_Querlen"),
                ),
            )
    }

    @Test
    fun `Should return empty result when no regulatory areas match filters`() {
        // Given
        BDDMockito
            .given(
                getAllRegulatoryAreas.execute(
                    controlPlan = null,
                    searchQuery = "NonExistent",
                    seaFronts = null,
                    tags = null,
                    themes = null,
                ),
            ).willReturn(Pair(emptyMap(), 0L))

        // When
        mockMvc
            .perform(MockMvcRequestBuilders.get("/bff/v1/regulatory-areas?searchQuery=NonExistent"))
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("totalCount", Matchers.equalTo(0)))
    }

    @Test
    fun `Should filter regulatory areas by tags`() {
        // Given
        val regulatoryAreaGroup = aRegulatoryArea(layerName = "ZMEL_Cale_Querlen")
        BDDMockito
            .given(
                getAllRegulatoryAreas.execute(
                    controlPlan = null,
                    searchQuery = null,
                    seaFronts = null,
                    tags = listOf(5),
                    themes = null,
                ),
            ).willReturn(Pair(mapOf(regulatoryAreaGroup to listOf(regulatoryArea)), 1L))

        // When
        mockMvc
            .perform(MockMvcRequestBuilders.get("/bff/v1/regulatory-areas?tags=5"))
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].tags[0].name",
                    Matchers.equalTo("Mouillage"),
                ),
            )
    }

    @Test
    fun `Should filter regulatory areas by themes`() {
        // Given
        val regulatoryAreaGroup = aRegulatoryArea(layerName = "ZMEL_Cale_Querlen")

        BDDMockito
            .given(
                getAllRegulatoryAreas.execute(
                    controlPlan = null,
                    searchQuery = null,
                    seaFronts = null,
                    tags = null,
                    themes = listOf(101),
                ),
            ).willReturn(Pair(mapOf(regulatoryAreaGroup to listOf(regulatoryArea)), 1L))

        // When
        mockMvc
            .perform(MockMvcRequestBuilders.get("/bff/v1/regulatory-areas?themes=101"))
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(
                MockMvcResultMatchers.jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].themes[0].name",
                    Matchers.equalTo("Zone de mouillage et d'équipement léger (ZMEL)"),
                ),
            )
    }

    @Test
    fun `Should create new regulatory area`() {
        // Given
        val regulatoryAreaToComplete =
            RegulatoryAreaEntity(
                id = 9999,
                areaType = AreaTypeEnum.ZONE,
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
                tags = listOf(TagFixture.Companion.aTag(id = 5, name = "Mouillage")),
                themes = listOf(ThemeFixture.Companion.aTheme(id = 9, name = "AMP")),
                date = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                dateFin = ZonedDateTime.parse("2034-01-01T00:00:00Z"),
                place = null,
                plan = "PIRC",
                polyName = "New Zone",
                resume = "New zone description",
                type = "ZPM",
                authorizationPeriods = null,
                prohibitionPeriods = null,
                additionalRefReg = null,
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
                place = null,
            )

        BDDMockito
            .given(
                createOrUpdateRegulatoryArea.execute(
                    regulatoryArea = requestBody.toRegulatoryAreaEntity(),
                ),
            ).willReturn(regulatoryAreaToComplete)

        // When
        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .put("/bff/v1/regulatory-areas")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(requestBody)),
            )
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.equalTo(9999)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.layerName", Matchers.equalTo("New_Layer")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.facade", Matchers.equalTo("MED")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.refReg", Matchers.equalTo("New regulation reference")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.resume", Matchers.equalTo("New zone description")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.plan", Matchers.equalTo("PIRC")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.polyName", Matchers.equalTo("New Zone")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.type", Matchers.equalTo("ZPM")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.tags[0].name", Matchers.equalTo("Mouillage")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.themes[0].name", Matchers.equalTo("AMP")))
    }

    @Test
    fun `Should update existing regulatory area`() {
        // Given
        val updatedRegulatoryArea =
            RegulatoryAreaEntity(
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
                        TagFixture.Companion.aTag(id = 5, name = "Mouillage"),
                        TagFixture.Companion.aTag(id = 6, name = "Extraction granulats"),
                    ),
                themes = listOf(ThemeFixture.Companion.aTheme(id = 9, name = "AMP")),
                date = ZonedDateTime.parse("2020-07-01T04:50:09Z"),
                dateFin = ZonedDateTime.parse("2040-07-01T04:50:09Z"),
                place = null,
                plan = "PIRC",
                polyName = "Zone mise à jour",
                resume = "Description mise à jour",
                type = "AMP",
                authorizationPeriods = null,
                prohibitionPeriods = null,
                additionalRefReg = null,
                areaType = AreaTypeEnum.ZONE,
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
                dateFin = ZonedDateTime.parse("2040-07-01T04:50:09Z"),
                plan = "PIRC",
                place = null,
                polyName = "Zone mise à jour",
                resume = "Description mise à jour",
                type = "AMP",
                authorizationPeriods = null,
                prohibitionPeriods = null,
                additionalRefReg = null,
            )

        BDDMockito
            .given(
                createOrUpdateRegulatoryArea.execute(
                    argThat {
                        id == 17
                    },
                ),
            ).willReturn(updatedRegulatoryArea)

        // When
        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .put("/bff/v1/regulatory-areas")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(requestBody)),
            ).andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.equalTo(17)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.layerName", Matchers.equalTo("ZMEL_Cale_Querlen_Updated")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.facade", Matchers.equalTo("NAMO")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.resume", Matchers.equalTo("Description mise à jour")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.polyName", Matchers.equalTo("Zone mise à jour")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.type", Matchers.equalTo("AMP")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.tags.length()", Matchers.equalTo(2)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.themes.length()", Matchers.equalTo(1)))
    }

    @Test
    fun `Should retrieve regulatory areas that match ids`() {
        // Given
        val regulatoryArea2 =
            RegulatoryAreaEntity(
                id = 18,
                areaType = AreaTypeEnum.ZONE,
                geom = polygon,
                url = "https://example.com/area-18",
                creation = ZonedDateTime.parse("2022-01-15T10:30:00Z"),
                layerName = "AMP_Test_Zone",
                facade = "MED",
                refReg = "Arrêté préfectoral N°2022-001",
                editionBo = ZonedDateTime.parse("2022-01-16T10:30:00Z"),
                editionCacem = null,
                editeur = "Jean Dupont",
                source = "",
                observation = "",
                tags = listOf(TagFixture.Companion.aTag(name = "AMP", id = 3)),
                themes =
                    listOf(
                        ThemeFixture.Companion.aTheme(
                            name = "Aire Marine Protégée",
                            id = 102,
                        ),
                    ),
                date = ZonedDateTime.parse("2022-01-01T00:00:00Z"),
                dateFin = ZonedDateTime.parse("2032-01-01T00:00:00Z"),
                place = null,
                plan = "AMP",
                polyName = "Zone protégée test",
                resume = "Zone de protection marine",
            )

        val ids = listOf(17, 18)
        val body = RegulatoryAreaByIdsDataInput(ids = ids, axis = AxisEnum.NORTH_SOUTH)
        BDDMockito
            .given(
                getRegulatoryAreaByIds.execute(ids, AxisEnum.NORTH_SOUTH),
            ).willReturn(listOf(regulatoryArea, regulatoryArea2))

        // When
        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/bff/v1/regulatory-areas")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(body)),
            ).andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize<Any>(2)))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", Matchers.equalTo(17)))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].layerName", Matchers.equalTo("ZMEL_Cale_Querlen")))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].facade", Matchers.equalTo("NAMO")))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].plan", Matchers.equalTo("PIRC")))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].id", Matchers.equalTo(18)))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].layerName", Matchers.equalTo("AMP_Test_Zone")))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].facade", Matchers.equalTo("MED")))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].plan", Matchers.equalTo("AMP")))
    }
}
