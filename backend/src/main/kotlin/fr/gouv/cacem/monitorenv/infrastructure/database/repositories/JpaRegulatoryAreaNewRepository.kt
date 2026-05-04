package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum
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
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.GeometryFactory
import org.locationtech.jts.geom.PrecisionModel
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.json.JsonMapper

@Repository
class JpaRegulatoryAreaNewRepository(
    private val dbRegulatoryAreaRepository: IDBRegulatoryAreaNewRepository,
    private val dbTagVigilanceAreaRepository: IDBTagRegulatoryAreaRepository,
    private val dbThemeRegulatoryAreaRepository: IDBThemeRegulatoryAreaRepository,
    private val mapper: JsonMapper,
) : IRegulatoryAreaNewRepository {
    override fun findById(id: Int): RegulatoryAreaEntity? =
        dbRegulatoryAreaRepository.findByIdOrNull(id)?.toRegulatoryArea(mapper)

    override fun findAll(
        controlPlan: String?,
        query: String?,
        seaFronts: List<String>?,
        tags: List<Int>?,
        themes: List<Int>?,
        onlyRecentsAreas: Boolean?,
        withGeometry: Boolean,
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
                withGeometry = withGeometry,
                geom = bbox?.let { bboxToPolygon(it) },
            ).map { it.toRegulatoryArea(mapper, withGeometry, zoom) }

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
