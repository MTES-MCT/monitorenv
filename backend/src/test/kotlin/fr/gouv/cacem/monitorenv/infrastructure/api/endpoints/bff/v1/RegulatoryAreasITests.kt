package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v2

import com.nhaarman.mockitokotlin2.argThat
import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.CreateOrUpdateRegulatoryArea
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.CreateOrUpdateRegulatoryAreaGroup
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllLayerNames
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreasTiles
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreasToComplete
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreaByIds
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreasGroupById
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupWithTotalDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture.Companion.aRegulatoryAreaGroupDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea.RegulatoryAreaByIdsDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea.RegulatoryAreaDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags.TagInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.themes.ThemeInput
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.AbstractEndpointTests
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1.RegulatoryAreas
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithAnonymousUser
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.json.JsonMapper
import java.time.ZonedDateTime

@WithMockUser
@WebMvcTest(value = [(RegulatoryAreas::class)])
class RegulatoryAreasITests : AbstractEndpointTests() {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getAllRegulatoryAreas: GetAllRegulatoryAreas

    @MockitoBean
    private lateinit var getAllRegulatoryAreasTiles: GetAllRegulatoryAreasTiles

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

    @Test
    @WithAnonymousUser
    fun `getAll() should return 403 when the user is authenticated without roles`() {
        mockMvc
            .perform(get("/bff/v1/regulatory-areas"))
            .andExpect(status().isForbidden)
    }

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
            location = null,
            resume = "Descriptif de la zone réglementaire",
            areaType = AreaTypeEnum.ZONE,
        )

    @Test
    fun `Should get all regulatory Areas`() {
        // Given
        val regulatoryAreaGroup =
            RegulatoryAreaFixture.aRegulatoryAreaGroupDTO(
                layerName = "ZMEL_Cale_Querlen",
                areas = listOf(regulatoryArea),
            )

        BDDMockito
            .given(
                getAllRegulatoryAreas.execute(
                    filters = SearchFilters(),
                ),
            ).willReturn(Pair(listOf(regulatoryAreaGroup), 1L))

        // When
        mockMvc
            .perform(get("/bff/v1/regulatory-areas"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(
                jsonPath(
                    "regulatoryAreasByLayer.[0].group.layerName",
                    Matchers.equalTo("ZMEL_Cale_Querlen"),
                ),
            ).andExpect(
                jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].id",
                    Matchers.equalTo(regulatoryArea.id),
                ),
            ).andExpect(
                jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].layerName",
                    Matchers.equalTo(regulatoryArea.layerName),
                ),
            ).andExpect(
                jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].refReg",
                    Matchers.equalTo(regulatoryArea.refReg),
                ),
            ).andExpect(
                jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].tags[0].name",
                    Matchers.equalTo("Mouillage"),
                ),
            ).andExpect(
                jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].type",
                    Matchers.equalTo(regulatoryArea.type),
                ),
            ).andExpect(
                jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].themes[0].name",
                    Matchers.equalTo("Zone de mouillage et d'équipement léger (ZMEL)"),
                ),
            ).andExpect(
                jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].plan",
                    Matchers.equalTo("PIRC"),
                ),
            ).andExpect(
                jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].polyName",
                    Matchers.equalTo("Zone au sud de la cale"),
                ),
            ).andExpect(
                jsonPath(
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
            .perform(get("/bff/v1/regulatory-areas/17"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", Matchers.equalTo(regulatoryArea.id)))
            .andExpect(jsonPath("$.layerName", Matchers.equalTo(regulatoryArea.layerName)))
            .andExpect(jsonPath("$.refReg", Matchers.equalTo(regulatoryArea.refReg)))
            .andExpect(jsonPath("$.tags[0].name", Matchers.equalTo("Mouillage")))
            .andExpect(
                jsonPath(
                    "$.themes[0].name",
                    Matchers.equalTo("Zone de mouillage et d'équipement léger (ZMEL)"),
                ),
            ).andExpect(jsonPath("$.plan", Matchers.equalTo("PIRC")))
    }


    @Test
    fun `Should return not found when regulatory area does not exist`() {
        // Given
        BDDMockito.given(getRegulatoryAreaById.execute(999)).willReturn(null)

        // When
        mockMvc
            .perform(get("/bff/v1/regulatory-areas/999"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$").doesNotExist())
    }

    @Test
    fun `Should get all layer names`() {
        // Given
        val layerNames =
            listOf(
                RegulatoryAreaGroupWithTotalDTO(
                    group = RegulatoryAreaFixture.aRegulatoryArea(layerName = "ZMEL_Cale_Querlen"),
                    total = 1,
                ),
                RegulatoryAreaGroupWithTotalDTO(
                    group = RegulatoryAreaFixture.aRegulatoryArea(layerName = "AMP_Zone_1"),
                    total = 1,
                ),
                RegulatoryAreaGroupWithTotalDTO(
                    group = RegulatoryAreaFixture.aRegulatoryArea(layerName = "PIRC_Area_2"),
                    total = 1,
                ),
            )

        BDDMockito.given(getAllLayerNames.execute()).willReturn(layerNames)

        // When
        mockMvc
            .perform(get("/bff/v1/regulatory-areas/layer-names"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].group.layerName").value("ZMEL_Cale_Querlen"))
            .andExpect(jsonPath("$[0].total").value(1))
            .andExpect(jsonPath("$[1].group.layerName").value("AMP_Zone_1"))
            .andExpect(jsonPath("$[1].total").value(1))
            .andExpect(jsonPath("$[2].group.layerName").value("PIRC_Area_2"))
            .andExpect(jsonPath("$[2].total").value(1))
    }

    @Test
    fun `Should get empty list when no layer names exist`() {
        // Given
        BDDMockito.given(getAllLayerNames.execute()).willReturn(emptyList())

        // When
        mockMvc
            .perform(get("/bff/v1/regulatory-areas/layer-names"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$").isEmpty)
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
                location = null,
                plan = null,
                polyName = null,
                areaType = AreaTypeEnum.ZONE,
                resume = null,
            )
        BDDMockito.given(getAllRegulatoryAreasToComplete.execute()).willReturn(listOf(regulatoryArea))

        // When
        mockMvc
            .perform(get("/bff/v1/regulatory-areas/to-complete"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", Matchers.equalTo(regulatoryArea.id)))
    }

    @Test
    fun `Should filter regulatory areas by seaFronts`() {
        // Given
        val regulatoryAreaGroup =
            RegulatoryAreaFixture.aRegulatoryAreaGroupDTO(
                layerName = "ZMEL_Cale_Querlen",
                areas = listOf(regulatoryArea),
            )

        BDDMockito
            .given(
                getAllRegulatoryAreas.execute(
                    filters = SearchFilters(seaFronts = listOf("NAMO")),
                ),
            ).willReturn(Pair(listOf(regulatoryAreaGroup), 1L))

        // When
        mockMvc
            .perform(get("/bff/v1/regulatory-areas?seaFronts=NAMO"))
            // Then
            .andExpect(status().isOk)
            .andExpect(
                jsonPath(
                    "regulatoryAreasByLayer[0].group.layerName",
                    Matchers.equalTo("ZMEL_Cale_Querlen"),
                ),
            ).andExpect(
                jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].facade",
                    Matchers.equalTo("NAMO"),
                ),
            )
    }

    @Test
    fun `Should filter regulatory areas by searchQuery`() {
        // Given
        val regulatoryAreaGroup =
            RegulatoryAreaFixture.aRegulatoryAreaGroupDTO(
                layerName = "ZMEL_Cale_Querlen",
                areas = listOf(regulatoryArea),
            )

        BDDMockito
            .given(
                getAllRegulatoryAreas.execute(
                    filters = SearchFilters(query = "Querlen"),
                ),
            ).willReturn(Pair(listOf(regulatoryAreaGroup), 1L))

        // When
        mockMvc
            .perform(get("/bff/v1/regulatory-areas?searchQuery=Querlen"))
            // Then
            .andExpect(status().isOk)
            .andExpect(
                jsonPath(
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
                    filters = SearchFilters(query = "NonExistent"),
                ),
            ).willReturn(Pair(listOf(), 0L))

        // When
        mockMvc
            .perform(get("/bff/v1/regulatory-areas?searchQuery=NonExistent"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("totalCount", Matchers.equalTo(0)))
    }

    @Test
    fun `Should filter regulatory areas by tags`() {
        // Given
        val regulatoryAreaGroup =
            RegulatoryAreaFixture.aRegulatoryAreaGroupDTO(
                layerName = "ZMEL_Cale_Querlen",
                areas = listOf(regulatoryArea),
            )

        BDDMockito
            .given(
                getAllRegulatoryAreas.execute(
                    filters = SearchFilters(tags = listOf(5)),
                ),
            ).willReturn(Pair(listOf(regulatoryAreaGroup), 1L))

        // When
        mockMvc
            .perform(get("/bff/v1/regulatory-areas?tags=5"))
            // Then
            .andExpect(status().isOk)
            .andExpect(
                jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].tags[0].name",
                    Matchers.equalTo("Mouillage"),
                ),
            )
    }

    @Test
    fun `Should filter regulatory areas by themes`() {
        // Given
        val regulatoryAreaGroup =
            RegulatoryAreaFixture.aRegulatoryAreaGroupDTO(
                layerName = "ZMEL_Cale_Querlen",
                areas = listOf(regulatoryArea),
            )

        BDDMockito
            .given(
                getAllRegulatoryAreas.execute(
                    filters = SearchFilters(themes = listOf(101)),
                ),
            ).willReturn(Pair(listOf(regulatoryAreaGroup), 1L))

        // When
        mockMvc
            .perform(get("/bff/v1/regulatory-areas?themes=101"))
            // Then
            .andExpect(status().isOk)
            .andExpect(
                jsonPath(
                    "regulatoryAreasByLayer[0].regulatoryAreas[0].themes[0].name",
                    Matchers.equalTo("Zone de mouillage et d'équipement léger (ZMEL)"),
                ),
            )
    }

    @Test
    fun `Should filter regulatory areas by last modification dates`() {
        // Given
        val regulatoryAreaGroup =
            aRegulatoryAreaGroupDTO(layerName = "ZMEL_Cale_Querlen", areas = listOf(regulatoryArea))

        BDDMockito
            .given(
                getAllRegulatoryAreas.execute(
                    filters = SearchFilters(lastModificationFrom = "2020-01-01T00:00:00.000Z"),
                ),
            ).willReturn(Pair(listOf(regulatoryAreaGroup), 1L))

        // When
        mockMvc
            .perform(
                get("/bff/v1/regulatory-areas?lastModificationFrom=2020-01-01T00:00:00.000Z"),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(
                jsonPath(
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
                tags = listOf(TagFixture.aTag(id = 5, name = "Mouillage")),
                themes = listOf(ThemeFixture.aTheme(id = 9, name = "AMP")),
                date = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                dateFin = ZonedDateTime.parse("2034-01-01T00:00:00Z"),
                location = null,
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
                location = null,
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
                    .content(mapper.writeValueAsString(requestBody))
                    .with(csrf()),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", Matchers.equalTo(9999)))
            .andExpect(jsonPath("$.layerName", Matchers.equalTo("New_Layer")))
            .andExpect(jsonPath("$.facade", Matchers.equalTo("MED")))
            .andExpect(jsonPath("$.refReg", Matchers.equalTo("New regulation reference")))
            .andExpect(jsonPath("$.resume", Matchers.equalTo("New zone description")))
            .andExpect(jsonPath("$.plan", Matchers.equalTo("PIRC")))
            .andExpect(jsonPath("$.polyName", Matchers.equalTo("New Zone")))
            .andExpect(jsonPath("$.type", Matchers.equalTo("ZPM")))
            .andExpect(jsonPath("$.tags[0].name", Matchers.equalTo("Mouillage")))
            .andExpect(jsonPath("$.themes[0].name", Matchers.equalTo("AMP")))
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
                        TagFixture.aTag(id = 5, name = "Mouillage"),
                        TagFixture.aTag(id = 6, name = "Extraction granulats"),
                    ),
                themes = listOf(ThemeFixture.aTheme(id = 9, name = "AMP")),
                date = ZonedDateTime.parse("2020-07-01T04:50:09Z"),
                dateFin = ZonedDateTime.parse("2040-07-01T04:50:09Z"),
                location = null,
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
                location = null,
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
                    .content(mapper.writeValueAsString(requestBody)).with(csrf()),
            ).andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", Matchers.equalTo(17)))
            .andExpect(jsonPath("$.layerName", Matchers.equalTo("ZMEL_Cale_Querlen_Updated")))
            .andExpect(jsonPath("$.facade", Matchers.equalTo("NAMO")))
            .andExpect(jsonPath("$.resume", Matchers.equalTo("Description mise à jour")))
            .andExpect(jsonPath("$.polyName", Matchers.equalTo("Zone mise à jour")))
            .andExpect(jsonPath("$.type", Matchers.equalTo("AMP")))
            .andExpect(jsonPath("$.tags.length()", Matchers.equalTo(2)))
            .andExpect(jsonPath("$.themes.length()", Matchers.equalTo(1)))
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
                tags = listOf(TagFixture.aTag(name = "AMP", id = 3)),
                themes =
                    listOf(
                        ThemeFixture.aTheme(
                            name = "Aire Marine Protégée",
                            id = 102,
                        ),
                    ),
                date = ZonedDateTime.parse("2022-01-01T00:00:00Z"),
                dateFin = ZonedDateTime.parse("2032-01-01T00:00:00Z"),
                location = null,
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
                    .content(mapper.writeValueAsString(body)).with(csrf()),
            ).andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$", Matchers.hasSize<Any>(2)))
            .andExpect(jsonPath("$[0].id", Matchers.equalTo(17)))
            .andExpect(jsonPath("$[0].layerName", Matchers.equalTo("ZMEL_Cale_Querlen")))
            .andExpect(jsonPath("$[0].facade", Matchers.equalTo("NAMO")))
            .andExpect(jsonPath("$[0].plan", Matchers.equalTo("PIRC")))
            .andExpect(jsonPath("$[1].id", Matchers.equalTo(18)))
            .andExpect(jsonPath("$[1].layerName", Matchers.equalTo("AMP_Test_Zone")))
            .andExpect(jsonPath("$[1].facade", Matchers.equalTo("MED")))
            .andExpect(jsonPath("$[1].plan", Matchers.equalTo("AMP")))
    }
}
