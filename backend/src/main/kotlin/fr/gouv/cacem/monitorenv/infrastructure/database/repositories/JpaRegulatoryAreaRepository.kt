package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
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
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.GeometryFactory
import org.locationtech.jts.geom.PrecisionModel
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

    override fun findAll(
        controlPlan: String?,
        query: String?,
        seaFronts: List<String>?,
        tags: List<Int>?,
        themes: List<Int>?,
        onlyRecentsAreas: Boolean?,
        withGeometry: Boolean?,
        zoom: Int?,
        bbox: List<Double>?,
    ): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaRepository
            .findAll(
                controlPlan = controlPlan,
                seaFronts = seaFronts,
                tags = tags,
                themes = themes,
                onlyRecentsAreas = onlyRecentsAreas,
                withGeometry = withGeometry ?: true,
                zoom = zoom,
                geom = bbox?.let { bboxToPolygon(it) },
            ).map { it.toRegulatoryArea(mapper, withGeometry ?: true, zoom) }
            .filter { findBySearchQuery(it, query) }

    fun bboxToPolygon(bbox: List<Double>): Geometry {
        val minX = bbox[0]
        val minY = bbox[1]
        val maxX = bbox[2]
        val maxY = bbox[3]

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

    private fun normalizeField(input: String): String = StringUtils.stripAccents(input.replace(" ", ""))
}
