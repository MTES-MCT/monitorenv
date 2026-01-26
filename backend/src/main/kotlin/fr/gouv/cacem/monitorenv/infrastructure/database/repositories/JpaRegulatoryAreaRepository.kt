package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaRepository
import jakarta.transaction.Transactional
import org.locationtech.jts.geom.Geometry
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository

@Repository
class JpaRegulatoryAreaRepository(
    private val dbRegulatoryAreaRepository: IDBRegulatoryAreaRepository,
) : IRegulatoryAreaRepository {
    @Transactional
    override fun findAll(
        withGeometry: Boolean,
        zoom: Int?,
        bbox: List<Double>?,
    ): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaRepository
            .findAllByOrderByLayerName(
                zoom,
                bbox?.get(0),
                bbox?.get(1),
                bbox?.get(2),
                bbox?.get(3),
                withGeometry,
            ).map { it.toRegulatoryArea() }

    override fun findById(id: Int): RegulatoryAreaEntity? =
        dbRegulatoryAreaRepository.findByIdOrNull(id)?.toRegulatoryArea()

    override fun findAllByIds(ids: List<Int>): List<RegulatoryAreaEntity> =
        dbRegulatoryAreaRepository.findAllById(ids).map { it.toRegulatoryArea() }

    override fun count(): Long = dbRegulatoryAreaRepository.count()

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> =
        dbRegulatoryAreaRepository.findAllIdsByGeom(geometry)
}
