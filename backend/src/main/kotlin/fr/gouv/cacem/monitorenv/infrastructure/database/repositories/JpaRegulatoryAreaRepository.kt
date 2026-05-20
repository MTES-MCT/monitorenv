package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaPk
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaPk
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBTagRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBThemeRegulatoryAreaRepository
import org.apache.commons.lang3.StringUtils
import org.locationtech.jts.geom.Geometry
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.json.JsonMapper

@Repository
class JpaRegulatoryAreaRepository(
    private val dbRegulatoryAreaRepository: IDBRegulatoryAreaRepository,
    private val dbTagVigilanceAreaRepository: IDBTagRegulatoryAreaRepository,
    private val dbThemeRegulatoryAreaRepository: IDBThemeRegulatoryAreaRepository,
    private val mapper: JsonMapper,
) : IRegulatoryAreaRepository {
    override fun findById(id: Int): RegulatoryAreaEntity? =
        dbRegulatoryAreaRepository.findByIdOrNull(id)?.toRegulatoryArea(mapper)

    override fun findAll(filters: SearchFilters?): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaRepository
            .findAll(
                controlPlan = filters?.controlPlan,
                seaFronts = filters?.seaFronts,
                tags = filters?.tags,
                themes = filters?.themes,
                onlyRecentsAreas = filters?.onlyRecentsAreas,
            ).map { it.toRegulatoryArea(mapper) }
            .filter { findBySearchQuery(it, filters?.query) }

    @Cacheable(
        value = ["regulatory_areas_tiles"],
        key = "#z + '-' + #x + '-' + #y + '-' + #filters.hashCode()",
    )
    override fun findAllTiles(
        filters: SearchFilters?,
        x: Int,
        y: Int,
        z: Int,
    ): ByteArray =
        dbRegulatoryAreaRepository.findAllAsTiles(
            controlPlan = filters?.controlPlan,
            seaFronts = filters?.seaFronts?.toTypedArray(),
            tags = filters?.tags?.toTypedArray(),
            themes = filters?.themes?.toTypedArray(),
            onlyRecentsAreas = filters?.onlyRecentsAreas,
            query = filters?.query,
            x = x,
            y = y,
            z = z,
        )

    override fun findAllLayerNames(): Map<String, Long> =
        dbRegulatoryAreaRepository.findAllLayerNames().associate { row ->
            row[0] as String to row[1] as Long
        }

    override fun findAllByIds(
        ids: List<Int>,
        axis: AxisEnum,
    ): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaRepository.findAllCompleteByIds(ids, axis.toString()).map { it.toRegulatoryArea(mapper) }

    @Transactional
    override fun findAllToComplete(): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaRepository
            .findAllByCreationIsNull()
            .map { it.toRegulatoryArea(mapper) }

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> =
        dbRegulatoryAreaRepository.findAllIdsByGeom(geometry)

    @CacheEvict(value = ["regulatory_areas_tiles"], allEntries = true)
    @Transactional
    override fun save(regulatoryArea: RegulatoryAreaEntity): RegulatoryAreaEntity {
        val model = RegulatoryAreaModel.Companion.fromRegulatoryAreaEntity(regulatoryArea, mapper)
        val savedModel = dbRegulatoryAreaRepository.saveAndFlush(model)

        val savedTags = saveTags(savedModel, regulatoryArea.tags)
        val savedThemes = saveThemes(savedModel, regulatoryArea.themes)

        return savedModel
            .copy(tags = savedTags, themes = savedThemes)
            .toRegulatoryArea(mapper)
    }

    override fun count(): Long = dbRegulatoryAreaRepository.count()


    private fun saveTags(
        regulatoryAreaModel: RegulatoryAreaModel,
        tags: List<TagEntity>,
    ): List<TagRegulatoryAreaModel> {
        regulatoryAreaModel.id.let {
            dbTagVigilanceAreaRepository.deleteAllByRegulatoryAreaId(it)
        }
        val tagModels = TagRegulatoryAreaModel.Companion.fromTagEntities(tags, regulatoryAreaModel)
        tagModels.forEach { regulatoryAreaTag ->
            regulatoryAreaTag.id = TagRegulatoryAreaPk(regulatoryAreaTag.tag.id, regulatoryAreaModel.id)
        }
        return dbTagVigilanceAreaRepository.saveAll(tagModels)
    }

    private fun saveThemes(
        regulatoryAreaModel: RegulatoryAreaModel,
        themes: List<ThemeEntity>,
    ): List<ThemeRegulatoryAreaModel> {
        regulatoryAreaModel.id.let {
            dbThemeRegulatoryAreaRepository.deleteAllByRegulatoryAreaId(it)
        }
        val themeModels = ThemeRegulatoryAreaModel.Companion.fromThemesEntities(themes, regulatoryAreaModel)
        themeModels.forEach { regulatoryAreaTheme ->
            regulatoryAreaTheme.id = ThemeRegulatoryAreaPk(regulatoryAreaTheme.theme.id, regulatoryAreaModel.id)
        }
        return dbThemeRegulatoryAreaRepository.saveAll(themeModels)
    }

    private fun findBySearchQuery(
        regulatoryArea: RegulatoryAreaEntity,
        searchQuery: String?,
    ): Boolean {
        if (searchQuery.isNullOrBlank()) {
            return true
        }

        return listOf(
            regulatoryArea.layerName,
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
}
