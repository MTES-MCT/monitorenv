package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAMPRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.stereotype.Repository

@Repository
class JpaAMPRepository(private val dbAMPRepository: IDBAMPRepository) :
    IAMPRepository {
    override fun findAll(): List<AMPEntity> {
        return dbAMPRepository.findAll().map { it.toAMP() }.sortedBy { it.name.lowercase() }
    }

    override fun count(): Long {
        return dbAMPRepository.count()
    }

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> {
        return dbAMPRepository.findAllIdsByGeom(geometry)
    }
}
