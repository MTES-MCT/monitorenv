package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaNewRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaNewModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaNewModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaNewModel.Companion.fromTagEntities
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaNewPk
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaNewModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaNewModel.Companion.fromThemesEntities
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaNewPk
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaNewRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBTagRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBThemeRegulatoryAreaRepository
import org.apache.commons.lang3.StringUtils
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
    override fun findById(id: Int): RegulatoryAreaNewEntity? =
        dbRegulatoryAreaRepository.findByIdOrNull(id)?.toRegulatoryArea(mapper)

    override fun findAll(
        query: String?,
        seaFronts: List<String>?,
        tags: List<Int>?,
        themes: List<Int>?,
    ): List<RegulatoryAreaNewEntity> =
        dbRegulatoryAreaRepository
            .findAll(seaFronts = seaFronts, tags = tags, themes = themes)
            .map { it.toRegulatoryArea(mapper) }
            .filter { findBySearchQuery(it, query) }

    override fun findAllLayerNames(): Map<String, Long> =
        dbRegulatoryAreaRepository.findAllLayerNames().associate { row ->
            row[0] as String to row[1] as Long
        }

    @Transactional
    override fun findAllToComplete(): List<RegulatoryAreaNewEntity> =
        dbRegulatoryAreaRepository
            .findAllByCreationIsNull()
            .map { it.toRegulatoryArea(mapper) }

    @Transactional
    override fun save(regulatoryArea: RegulatoryAreaNewEntity): RegulatoryAreaNewEntity {
        val model = RegulatoryAreaNewModel.fromRegulatoryAreaEntity(regulatoryArea, mapper)
        val savedModel = dbRegulatoryAreaRepository.saveAndFlush(model)

        val savedTags = saveTags(savedModel, regulatoryArea.tags)
        val savedThemes = saveThemes(savedModel, regulatoryArea.themes)

        return savedModel
            .copy(tags = savedTags, themes = savedThemes)
            .toRegulatoryArea(mapper)
    }

    private fun findBySearchQuery(
        regulatoryArea: RegulatoryAreaNewEntity,
        searchQuery: String?,
    ): Boolean {
        if (searchQuery.isNullOrBlank()) {
            return true
        }

        return listOf(
            regulatoryArea.layerName,
            regulatoryArea.resume,
            regulatoryArea.polyName,
        ).any { field ->
            !field.isNullOrBlank() &&
                normalizeField(field)
                    .contains(normalizeField(searchQuery), ignoreCase = true)
        }
    }

    private fun saveTags(
        regulatoryAreaModel: RegulatoryAreaNewModel,
        tags: List<TagEntity>,
    ): List<TagRegulatoryAreaNewModel> {
        regulatoryAreaModel.id.let {
            dbTagVigilanceAreaRepository.deleteAllByRegulatoryAreaId(it)
        }
        val tagModels = fromTagEntities(tags, regulatoryAreaModel)
        tagModels.forEach { regulatoryAreaTag ->
            regulatoryAreaTag.id = TagRegulatoryAreaNewPk(regulatoryAreaTag.tag.id, regulatoryAreaModel.id)
        }
        return dbTagVigilanceAreaRepository.saveAll(tagModels)
    }

    private fun saveThemes(
        regulatoryAreaModel: RegulatoryAreaNewModel,
        themes: List<ThemeEntity>,
    ): List<ThemeRegulatoryAreaNewModel> {
        regulatoryAreaModel.id.let {
            dbThemeRegulatoryAreaRepository.deleteAllByRegulatoryAreaId(it)
        }
        val themeModels = fromThemesEntities(themes, regulatoryAreaModel)
        themeModels.forEach { regulatoryAreaTheme ->
            regulatoryAreaTheme.id = ThemeRegulatoryAreaNewPk(regulatoryAreaTheme.theme.id, regulatoryAreaModel.id)
        }
        return dbThemeRegulatoryAreaRepository.saveAll(themeModels)
    }

    private fun normalizeField(input: String): String = StringUtils.stripAccents(input.replace(" ", ""))
}
