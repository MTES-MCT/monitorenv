package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.v2.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaNewRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaNewModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaNewModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaNewPk
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaNewModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaNewPk
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaNewRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBTagRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBThemeRegulatoryAreaRepository
import org.apache.commons.lang3.StringUtils
import org.locationtech.jts.geom.Geometry
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaRegulatoryAreaNewRepository(
    private val dbRegulatoryAreaRepository: IDBRegulatoryAreaNewRepository,
    private val dbTagVigilanceAreaRepository: IDBTagRegulatoryAreaRepository,
    private val dbThemeRegulatoryAreaRepository: IDBThemeRegulatoryAreaRepository,
    private val mapper: ObjectMapper,
) : IRegulatoryAreaNewRepository {
    override fun findById(id: Int): RegulatoryAreaEntity? =
        dbRegulatoryAreaRepository.findByIdOrNull(id)?.toRegulatoryArea(mapper)

    override fun findAll(
        controlPlan: String?,
        query: String?,
        seaFronts: List<String>?,
        tags: List<Int>?,
        themes: List<Int>?,
    ): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaRepository
            .findAll(controlPlan = controlPlan, seaFronts = seaFronts, tags = tags, themes = themes)
            .map { it.toRegulatoryArea(mapper) }
            .filter { findBySearchQuery(it, query) }

    override fun findAllLayerNames(): Map<String, Long> =
        dbRegulatoryAreaRepository.findAllLayerNames().associate { row ->
            row[0] as String to row[1] as Long
        }

    override fun findAllByIds(
        ids: List<Int>,
        axis: String,
    ): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaRepository.findAllCompleteByIds(ids, axis).map { it.toRegulatoryArea(mapper) }

    @Transactional
    override fun findAllToComplete(): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaRepository
            .findAllByCreationIsNull()
            .map { it.toRegulatoryArea(mapper) }

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> =
        dbRegulatoryAreaRepository.findAllIdsByGeom(geometry)

    @Transactional
    override fun save(regulatoryArea: RegulatoryAreaEntity): RegulatoryAreaEntity {
        val model = RegulatoryAreaNewModel.Companion.fromRegulatoryAreaEntity(regulatoryArea, mapper)
        val savedModel = dbRegulatoryAreaRepository.saveAndFlush(model)

        val savedTags = saveTags(savedModel, regulatoryArea.tags)
        val savedThemes = saveThemes(savedModel, regulatoryArea.themes)

        return savedModel
            .copy(tags = savedTags, themes = savedThemes)
            .toRegulatoryArea(mapper)
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

    private fun saveTags(
        regulatoryAreaNewModel: RegulatoryAreaNewModel,
        tags: List<TagEntity>,
    ): List<TagRegulatoryAreaNewModel> {
        regulatoryAreaNewModel.id.let {
            dbTagVigilanceAreaRepository.deleteAllByRegulatoryAreaId(it)
        }
        val tagModels = TagRegulatoryAreaNewModel.Companion.fromTagEntities(tags, regulatoryAreaNewModel)
        tagModels.forEach { regulatoryAreaTag ->
            regulatoryAreaTag.id = TagRegulatoryAreaNewPk(regulatoryAreaTag.tag.id, regulatoryAreaNewModel.id)
        }
        return dbTagVigilanceAreaRepository.saveAll(tagModels)
    }

    private fun saveThemes(
        regulatoryAreaNewModel: RegulatoryAreaNewModel,
        themes: List<ThemeEntity>,
    ): List<ThemeRegulatoryAreaNewModel> {
        regulatoryAreaNewModel.id.let {
            dbThemeRegulatoryAreaRepository.deleteAllByRegulatoryAreaId(it)
        }
        val themeModels = ThemeRegulatoryAreaNewModel.Companion.fromThemesEntities(themes, regulatoryAreaNewModel)
        themeModels.forEach { regulatoryAreaTheme ->
            regulatoryAreaTheme.id = ThemeRegulatoryAreaNewPk(regulatoryAreaTheme.theme.id, regulatoryAreaNewModel.id)
        }
        return dbThemeRegulatoryAreaRepository.saveAll(themeModels)
    }

    private fun normalizeField(input: String): String = StringUtils.stripAccents(input.replace(" ", ""))
}
