package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAMPRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.stereotype.Repository

@Repository
class JpaAMPRepository(
    private val dbAMPRepository: IDBAMPRepository,
) : IAMPRepository {
    override fun findAll(withGeometry: Boolean): List<AMPEntity> =
        dbAMPRepository.findAllByOrderByName().map { it.toAMP(withGeometry) }

    override fun count(): Long = dbAMPRepository.count()

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> = dbAMPRepository.findAllIdsByGeom(geometry)
}
