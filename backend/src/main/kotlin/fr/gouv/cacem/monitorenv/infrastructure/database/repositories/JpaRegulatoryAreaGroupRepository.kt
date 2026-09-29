package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupWithTotalDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaGroupModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaGroupPk
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaRepository
import org.apache.commons.lang3.StringUtils
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.GeometryFactory
import org.locationtech.jts.geom.PrecisionModel
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.json.JsonMapper
import java.time.ZonedDateTime

@Repository
class JpaRegulatoryAreaGroupRepository(
    private val dbRegulatoryAreaRepository: IDBRegulatoryAreaRepository,
    private val dbRegulatoryAreaGroupRepository: IDBRegulatoryAreaGroupRepository,
    private val mapper: JsonMapper,
) : IRegulatoryAreaGroupRepository {
    override fun findAll(filters: SearchFilters): List<RegulatoryAreaGroupDTO> {
        val groups =
            dbRegulatoryAreaGroupRepository
                .findAll(
                    controlPlan = filters.controlPlan,
                    scales = filters.scales,
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

    @Transactional
    override fun save(regulatoryAreaGroup: RegulatoryAreaGroupEntity): RegulatoryAreaGroupDTO {
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
                editionBo = null,
                editionCacem = null,
                facade = null,
                layerName = regulatoryAreaGroup.layerName,
                location = regulatoryAreaGroup.location,
                observation = null,
                plan = null,
                polyName = null,
                refReg = regulatoryAreaGroup.refReg,
                resume = null,
                source = null,
                tags = emptyList(),
                themes = emptyList(),
                type = regulatoryAreaGroup.type,
                url = regulatoryAreaGroup.url,
                additionalRefReg = regulatoryAreaGroup.additionalRefReg.let { mapper.valueToTree(it) },
                authorizationPeriods = null,
                prohibitionPeriods = null,
                scale = null,
            )
        val savedGroup = dbRegulatoryAreaRepository.save(groupToSave)

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
            val savedRegulatoryAreaGroup = dbRegulatoryAreaGroupRepository.saveAll(regulatoryAreaGroupModels)
            val group = savedRegulatoryAreaGroup.first().group.toRegulatoryArea(mapper)
            val areas =
                savedRegulatoryAreaGroup.map {
                    it.regulatoryArea.toRegulatoryArea(
                        mapper,
                        savedRegulatoryAreaGroup.first().group,
                    )
                }

            return RegulatoryAreaGroupDTO(group = group, areas = areas)
        }

        return RegulatoryAreaGroupDTO(group = savedGroup.toRegulatoryArea(mapper), areas = emptyList())
    }
}
