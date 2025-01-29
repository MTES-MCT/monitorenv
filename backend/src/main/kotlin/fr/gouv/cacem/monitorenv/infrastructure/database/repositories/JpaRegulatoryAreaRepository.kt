package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.stereotype.Repository

@Repository
class JpaRegulatoryAreaRepository(private val dbRegulatoryAreaRepository: IDBRegulatoryAreaRepository) :
    IRegulatoryAreaRepository {
    override fun findAll(): List<RegulatoryAreaEntity> {
        return dbRegulatoryAreaRepository.findAllByOrderByLayerName().map { it.toRegulatoryArea() }
    }

    override fun findById(id: Int): RegulatoryAreaEntity {
        return dbRegulatoryAreaRepository.findById(id).get().toRegulatoryArea()
    }

    override fun count(): Long {
        return dbRegulatoryAreaRepository.count()
    }

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> {
        return dbRegulatoryAreaRepository.findAllIdsByGeom(geometry)
    }
}
