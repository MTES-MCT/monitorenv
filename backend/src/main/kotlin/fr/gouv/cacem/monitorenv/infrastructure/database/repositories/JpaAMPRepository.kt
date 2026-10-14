package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum
import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAMPRepository
import fr.gouv.cacem.monitorenv.utils.GeometryUtils.Companion.extentToPolygon
import org.locationtech.jts.geom.Geometry
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository

@Repository
class JpaAMPRepository(
    private val dbAMPRepository: IDBAMPRepository,
) : IAMPRepository {
    override fun findById(id: Int): AMPEntity? = dbAMPRepository.findByIdOrNull(id)?.toAMP()

    @Cacheable(
        value = ["amps_tiles"],
        key = "#z + '-' + #x + '-' + #y + '-' + #filters.hashCode()",
    )
    override fun findAllTiles(
        filters: SearchFilters,
        x: Int,
        y: Int,
        z: Int,
    ): ByteArray =
        dbAMPRepository.findAllAsTiles(
            query = filters.query,
            onlyRecentsAreas = filters.onlyRecentsAreas,
            minX = filters.extent?.get(0),
            minY = filters.extent?.get(1),
            maxX = filters.extent?.get(2),
            maxY = filters.extent?.get(3),
            x = x,
            y = y,
            z = z,
        )

    override fun findAll(filters: SearchFilters): List<AMPEntity> =
        dbAMPRepository
            .findAll(
                onlyRecentsAreas = filters.onlyRecentsAreas,
                extent = filters.extent?.let { extentToPolygon(extent = it) },
            ).map { it.toAMP() }

    override fun count(): Long = dbAMPRepository.count()

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> = dbAMPRepository.findAllIdsByGeom(geometry)

    override fun findAllByIds(
        ids: List<Int>,
        axis: AxisEnum,
    ): List<AMPEntity> = dbAMPRepository.findAllByIds(ids, axis.toString()).map { it.toAMP() }
}
