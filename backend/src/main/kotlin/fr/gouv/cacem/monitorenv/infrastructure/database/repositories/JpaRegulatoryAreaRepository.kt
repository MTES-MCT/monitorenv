package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository

@Repository
class JpaRegulatoryAreaRepository(
    private val dbRegulatoryAreaRepository: IDBRegulatoryAreaRepository,
) : IRegulatoryAreaRepository {
    override fun findAll(withGeometry: Boolean): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaRepository.findAllByOrderByLayerName().map { it.toRegulatoryArea(withGeometry) }

    override fun findById(id: Int): RegulatoryAreaEntity? =
        dbRegulatoryAreaRepository.findByIdOrNull(id)?.toRegulatoryArea(true)

    override fun count(): Long = dbRegulatoryAreaRepository.count()

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> =
        dbRegulatoryAreaRepository.findAllIdsByGeom(geometry)
}
