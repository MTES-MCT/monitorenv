package fr.gouv.cacem.monitorenv.infrastructure.cacem.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.cacem.repositories.interfaces.IDBRegulatoryAreaNewRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository

@Repository
class JpaRegulatoryAreaNewRepository(
    private val dbRegulatoryAreaRepository: IDBRegulatoryAreaNewRepository,
) : IRegulatoryAreaRepository {
    override fun findAll(): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaRepository.findAllByOrderByLayerName().map { it.toRegulatoryArea() }

    override fun findById(id: Int): RegulatoryAreaEntity? =
        dbRegulatoryAreaRepository.findByIdOrNull(id)?.toRegulatoryArea()

    override fun count(): Long = dbRegulatoryAreaRepository.count()

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> =
        dbRegulatoryAreaRepository.findAllIdsByGeom(geometry)
}
