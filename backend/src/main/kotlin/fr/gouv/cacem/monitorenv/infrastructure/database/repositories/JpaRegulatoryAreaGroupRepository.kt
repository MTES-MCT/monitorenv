package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupWithTotalDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaGroupModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaGroupPk
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaPk
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaPk
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBTagRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBThemeRegulatoryAreaRepository
import org.apache.commons.lang3.StringUtils
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.GeometryFactory
import org.locationtech.jts.geom.PrecisionModel
import org.springframework.cache.annotation.CacheEvict
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.json.JsonMapper
import java.time.Instant
import java.time.ZonedDateTime

@Repository
class JpaRegulatoryAreaGroupRepository(
    private val dbRegulatoryAreaRepository: IDBRegulatoryAreaRepository,
    private val dbRegulatoryAreaGroupRepository: IDBRegulatoryAreaGroupRepository,
    private val dbTagRegulatoryAreaRepository: IDBTagRegulatoryAreaRepository,
    private val dbThemeRegulatoryAreaRepository: IDBThemeRegulatoryAreaRepository,
    private val mapper: JsonMapper,
) : IRegulatoryAreaGroupRepository {
    override fun findAll(filters: SearchFilters): List<RegulatoryAreaGroupDTO> {
        val groups =
            dbRegulatoryAreaGroupRepository
                .findAll(
                    controlPlan = filters.controlPlan,
                    lastModificationFrom = filters.lastModificationFrom,
                    lastModificationTo = filters.lastModificationTo,
                    seaFronts = filters.seaFronts,
                    tags = filters.tags,
                    themes = filters.themes,
                    onlyRecentsAreas =
                        filters.onlyRecentsAreas,
                    extent = filters.extent?.let { extentToPolygon(extent = it) },
                )
        return groups
            .groupBy { it.group }
            .map { (group, entries) ->
                RegulatoryAreaGroupDTO(
                    group = group.toRegulatoryArea(mapper = mapper),
                    areas =
                        entries
                            .map { it.regulatoryArea.toRegulatoryArea(mapper = mapper, group = it.group) }
                            .filter { findBySearchQuery(it, filters.query) },
                )
            }.filter { it.areas.isNotEmpty() }
    }

    fun extentToPolygon(extent: List<Double>): Geometry {
        val minX = extent[0]
        val minY = extent[1]
        val maxX = extent[2]
        val maxY = extent[3]

        val gf = GeometryFactory(PrecisionModel(), 4326)

        val coords: Array<Coordinate?> =
            arrayOf(
                Coordinate(minX, minY),
                Coordinate(maxX, minY),
                Coordinate(maxX, maxY),
                Coordinate(minX, maxY),
                Coordinate(minX, minY),
            )

        return gf.createPolygon(coords)
    }

    private fun findBySearchQuery(
        regulatoryArea: RegulatoryAreaEntity,
        searchQuery: String?,
    ): Boolean {
        if (searchQuery.isNullOrBlank()) {
            return true
        }

        return listOf(
            listOfNotNull(regulatoryArea.layerName, regulatoryArea.location).joinToString(" - "),
            regulatoryArea.refReg,
            regulatoryArea.resume,
            regulatoryArea.polyName,
        ).any { field ->
            !field.isNullOrBlank() &&
                normalizeField(field)
                    .contains(normalizeField(searchQuery), ignoreCase = true)
        }
    }

    private fun normalizeField(input: String): String = StringUtils.stripAccents(input.replace(" ", ""))

    override fun findAllLayerNames(): List<RegulatoryAreaGroupWithTotalDTO> =
        dbRegulatoryAreaGroupRepository.findAllLayerNames().map { regulatoryAreas ->
            RegulatoryAreaGroupWithTotalDTO(
                group = regulatoryAreas.group.toRegulatoryArea(mapper),
                total = regulatoryAreas.total,
            )
        }

    override fun findGroupById(id: Int): RegulatoryAreaGroupDTO? {
        val regulatoryAreaGroup = dbRegulatoryAreaRepository.findByIdOrNull(id)
        if (regulatoryAreaGroup === null) {
            return null
        }
        val regulatoryAreas = dbRegulatoryAreaGroupRepository.findAllByGroupId(id)

        return RegulatoryAreaGroupDTO(
            group = regulatoryAreaGroup.toRegulatoryArea(mapper),
            areas = regulatoryAreas.map { it.regulatoryArea.toRegulatoryArea(mapper, group = regulatoryAreaGroup) },
        )
    }

    override fun findGroupByRegulatoryAreaId(regulatoryAreaId: Int): RegulatoryAreaEntity? =
        dbRegulatoryAreaGroupRepository
            .findAllByRegulatoryAreaId(regulatoryAreaId)
            .firstOrNull()
            ?.group
            ?.toRegulatoryArea(mapper)

    override fun findGroupByLayerNameAndLocation(
        layerName: String,
        location: String?,
    ): RegulatoryAreaEntity? =
        dbRegulatoryAreaRepository
            .findAllGroupByLayerNameAndLocation(layerName = layerName, location = location)
            .singleOrNull()
            ?.toRegulatoryArea(mapper)

    @CacheEvict(value = ["regulatory_areas_tiles"], allEntries = true)
    @Transactional
    override fun save(
        regulatoryAreaGroup: RegulatoryAreaGroupEntity,
        regulatoryAreasToUpdate: List<RegulatoryAreaEntity>,
    ): RegulatoryAreaGroupDTO {
        var id = regulatoryAreaGroup.id
        if (id == null) {
            id = dbRegulatoryAreaRepository.findNextId()
        }
        val groupToSave =
            RegulatoryAreaModel(
                id = id,
                areaType = AreaTypeEnum.GROUP,
                geom = null,
                creation = ZonedDateTime.now().toInstant(),
                date = regulatoryAreaGroup.date?.toInstant(),
                dateFin = regulatoryAreaGroup.dateFin?.toInstant(),
                editeur = null,
                editionBo = ZonedDateTime.now().toInstant(),
                editionCacem = null,
                facade = null,
                layerName = regulatoryAreaGroup.layerName,
                location = regulatoryAreaGroup.location,
                observation = null,
                plan = null,
                polyName = null,
                refReg = regulatoryAreaGroup.refReg,
                resume = regulatoryAreaGroup.resume,
                source = null,
                tags = emptyList(),
                themes = emptyList(),
                type = regulatoryAreaGroup.type,
                url = regulatoryAreaGroup.url,
                additionalRefReg = regulatoryAreaGroup.additionalRefReg.let { mapper.valueToTree(it) },
                authorizationPeriods = regulatoryAreaGroup.authorizationPeriods,
                prohibitionPeriods = regulatoryAreaGroup.prohibitionPeriods,
                propagatedFields = regulatoryAreaGroup.propagatedFields.sorted(),
            )
        val savedGroup = dbRegulatoryAreaRepository.saveAndFlush(groupToSave)
        replaceThemes(savedGroup, regulatoryAreaGroup.themes)
        replaceTags(savedGroup, regulatoryAreaGroup.tags)

        updateRegulatoryAreas(regulatoryAreasToUpdate)

        dbRegulatoryAreaRepository.updateLayerNameAndLocationByIds(
            layerName = regulatoryAreaGroup.layerName,
            location = regulatoryAreaGroup.location,
            ids = regulatoryAreaGroup.regulatoryAreaIds,
        )

        if (regulatoryAreaGroup.regulatoryAreaIds.isNotEmpty()) {
            dbRegulatoryAreaGroupRepository.deleteAllByGroupId(id)

            val regulatoryAreaGroupModels =
                regulatoryAreaGroup.regulatoryAreaIds.map {
                    RegulatoryAreaGroupModel(
                        id =
                            RegulatoryAreaGroupPk(
                                regulatoryAreaId = it,
                                groupId = id,
                            ),
                        regulatoryArea = dbRegulatoryAreaRepository.getReferenceById(it),
                        group = dbRegulatoryAreaRepository.getReferenceById(id),
                    )
                }
            dbRegulatoryAreaGroupRepository.saveAll(regulatoryAreaGroupModels)
        }

        // Re-read the group so that the themes, tags and copied fields reflect what has been saved
        dbRegulatoryAreaRepository.flush()
        return requireNotNull(findGroupById(id)) { "Regulatory area group $id not found after save" }
    }

    private fun updateRegulatoryAreas(regulatoryAreas: List<RegulatoryAreaEntity>) {
        if (regulatoryAreas.isEmpty()) {
            return
        }

        val regulatoryAreaModels =
            dbRegulatoryAreaRepository
                .findAllById(
                    regulatoryAreas.map { it.id },
                ).associateBy { it.id }
        regulatoryAreas.forEach { regulatoryArea ->
            val regulatoryAreaModel = regulatoryAreaModels.getValue(regulatoryArea.id)
            val savedRegulatoryArea =
                dbRegulatoryAreaRepository.save(
                    regulatoryAreaModel.copy(
                        authorizationPeriods = regulatoryArea.authorizationPeriods,
                        editionBo = Instant.now(),
                        inheritedFields = regulatoryArea.inheritedFields,
                        prohibitionPeriods = regulatoryArea.prohibitionPeriods,
                        resume = regulatoryArea.resume,
                    ),
                )
            replaceThemes(savedRegulatoryArea, regulatoryArea.themes)
            replaceTags(savedRegulatoryArea, regulatoryArea.tags)
        }
        dbRegulatoryAreaRepository.flush()
    }

    private fun replaceThemes(
        regulatoryArea: RegulatoryAreaModel,
        themes: List<ThemeEntity>,
    ) {
        dbThemeRegulatoryAreaRepository.deleteAllByRegulatoryAreaId(regulatoryArea.id)
        val themeModels =
            ThemeRegulatoryAreaModel.fromThemesEntities(themes, regulatoryArea).onEach {
                it.id = ThemeRegulatoryAreaPk(it.theme.id, regulatoryArea.id)
            }
        dbThemeRegulatoryAreaRepository.saveAll(themeModels)
    }

    private fun replaceTags(
        regulatoryArea: RegulatoryAreaModel,
        tags: List<TagEntity>,
    ) {
        dbTagRegulatoryAreaRepository.deleteAllByRegulatoryAreaId(regulatoryArea.id)
        val tagModels =
            TagRegulatoryAreaModel.fromTagEntities(tags, regulatoryArea).onEach {
                it.id = TagRegulatoryAreaPk(it.tag.id, regulatoryArea.id)
            }
        dbTagRegulatoryAreaRepository.saveAll(tagModels)
    }
}
