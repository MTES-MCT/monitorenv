package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
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
import org.locationtech.jts.geom.Geometry
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.json.JsonMapper
import java.time.ZonedDateTime

@Repository
class JpaRegulatoryAreaRepository(
    private val dbRegulatoryAreaRepository: IDBRegulatoryAreaRepository,
    private val dbRegulatoryAreaGroupRepository: IDBRegulatoryAreaGroupRepository,
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
    ): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaGroupRepository
            .findAll(
                controlPlan = controlPlan,
                seaFronts = seaFronts,
                tags = tags,
                themes = themes,
                onlyRecentsAreas =
                onlyRecentsAreas,
            ).flatMap { it.toRegulatoryAreas(mapper) }
            .filter { findBySearchQuery(it, query) }

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
        val model = RegulatoryAreaModel.fromRegulatoryAreaEntity(regulatoryArea, mapper)
        val savedModel = dbRegulatoryAreaRepository.saveAndFlush(model)

        val savedTags = saveTags(savedModel, regulatoryArea.tags)
        val savedThemes = saveThemes(savedModel, regulatoryArea.themes)
        saveRegulatoryAreasGroup(regulatoryArea)

        return savedModel
            .copy(tags = savedTags, themes = savedThemes)
            .toRegulatoryArea(mapper)
    }

    override fun count(): Long = dbRegulatoryAreaRepository.count()

    private fun findBySearchQuery(
        regulatoryArea: RegulatoryAreaEntity,
        searchQuery: String?,
    ): Boolean {
        if (searchQuery.isNullOrBlank() || regulatoryArea.areaType == AreaTypeEnum.GROUP) {
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

    private fun saveRegulatoryAreasGroup(regulatoryArea: RegulatoryAreaEntity) {
        if (regulatoryArea.layerName != null) {
            val newRegulatoryAreaGroup =
                dbRegulatoryAreaGroupRepository.findAllByGroupName(groupName = regulatoryArea.layerName)
            dbRegulatoryAreaGroupRepository.deleteAllByRegulatoryAreaId(regulatoryArea.id)

            val isNotAttachedToGroup =
                newRegulatoryAreaGroup.find { it.group.layerName == regulatoryArea.layerName } == null
            if (isNotAttachedToGroup) {
                val group =
                    RegulatoryAreaModel(
                        id = null,
                        areaType = AreaTypeEnum.GROUP,
                        geom = regulatoryArea.geom,
                        creation = ZonedDateTime.now().toInstant(),
                        date = null,
                        dateFin = null,
                        editeur = null,
                        editionBo = null,
                        editionCacem = null,
                        facade = null,
                        layerName = regulatoryArea.layerName,
                        location = regulatoryArea.location,
                        observation = null,
                        plan = null,
                        polyName = null,
                        refReg = null,
                        resume = null,
                        source = null,
                        tags = listOf(),
                        themes = listOf(),
                        type = null,
                        url = null,
                        additionalRefReg = null,
                        authorizationPeriods = null,
                        prohibitionPeriods = null,
                    )
                val savedGroup = dbRegulatoryAreaRepository.save(group)
                dbRegulatoryAreaGroupRepository.save(
                    RegulatoryAreaGroupModel(
                        id =
                            RegulatoryAreaGroupPk(
                                regulatoryAreaId = regulatoryArea.id,
                                groupId = savedGroup.id,
                            ),
                        regulatoryArea =
                            RegulatoryAreaModel.fromRegulatoryAreaEntity(
                                regulatoryArea = regulatoryArea,
                                mapper = mapper,
                            ),
                        group = savedGroup,
                    ),
                )
            } else {
                newRegulatoryAreaGroup.firstOrNull()?.group?.let { group ->
                    dbRegulatoryAreaGroupRepository.save(
                        RegulatoryAreaGroupModel(
                            id =
                                RegulatoryAreaGroupPk(
                                    regulatoryAreaId = regulatoryArea.id,
                                    groupId = group.id,
                                ),
                            regulatoryArea =
                                RegulatoryAreaModel.fromRegulatoryAreaEntity(
                                    regulatoryArea = regulatoryArea,
                                    mapper = mapper,
                                ),
                            group = group,
                        ),
                    )
                }
            }
        }
    }

    private fun saveTags(
        regulatoryAreaModel: RegulatoryAreaModel,
        tags: List<TagEntity>,
    ): List<TagRegulatoryAreaModel> {
        regulatoryAreaModel.id?.let {
            dbTagVigilanceAreaRepository.deleteAllByRegulatoryAreaId(it)
        }
        val tagModels = TagRegulatoryAreaModel.fromTagEntities(tags, regulatoryAreaModel)
        tagModels.forEach { regulatoryAreaTag ->
            regulatoryAreaTag.id = TagRegulatoryAreaPk(regulatoryAreaTag.tag.id, regulatoryAreaModel.id)
        }
        return dbTagVigilanceAreaRepository.saveAll(tagModels)
    }

    private fun saveThemes(
        regulatoryAreaModel: RegulatoryAreaModel,
        themes: List<ThemeEntity>,
    ): List<ThemeRegulatoryAreaModel> {
        regulatoryAreaModel.id?.let {
            dbThemeRegulatoryAreaRepository.deleteAllByRegulatoryAreaId(it)
        }
        val themeModels = ThemeRegulatoryAreaModel.fromThemesEntities(themes, regulatoryAreaModel)
        themeModels.forEach { regulatoryAreaTheme ->
            regulatoryAreaTheme.id = ThemeRegulatoryAreaPk(regulatoryAreaTheme.theme.id, regulatoryAreaModel.id)
        }
        return dbThemeRegulatoryAreaRepository.saveAll(themeModels)
    }

    private fun normalizeField(input: String): String = StringUtils.stripAccents(input.replace(" ", ""))
}
