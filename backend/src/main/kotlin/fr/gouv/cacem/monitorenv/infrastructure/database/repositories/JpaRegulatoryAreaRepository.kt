package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository

@Repository
class JpaRegulatoryAreaRepository(
    private val dbRegulatoryAreaRepository: IDBRegulatoryAreaRepository,
) : IRegulatoryAreaRepository {
    override fun findAll(): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaRepository.findAllByOrderByLayerName().map { toRegulatoryAreaEntity(it) }

    override fun findById(id: Int): RegulatoryAreaEntity? {
        val regulatoryArea = dbRegulatoryAreaRepository.findByIdOrNull(id)
        regulatoryArea?.let {
            return toRegulatoryAreaEntity(it)
        }
        return null
    }

    private fun toRegulatoryAreaEntity(regulatoryArea: RegulatoryAreaModel): RegulatoryAreaEntity {
        val tags = regulatoryArea.tags
        val parents = tags.map { it.tag }.filter { it.parent === null }

        for (parent in parents) {
            val subTags = tags.filter { it.tag.parent?.id == parent.id }.map { it.tag }
            parent.subTags = subTags
        }
        return regulatoryArea.toRegulatoryArea(parents)
    }

    override fun count(): Long = dbRegulatoryAreaRepository.count()

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> =
        dbRegulatoryAreaRepository.findAllIdsByGeom(geometry)
}
